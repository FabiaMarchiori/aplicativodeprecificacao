import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para verificar JWT com HMAC-SHA256
async function verifyJWT(token: string, secret: string): Promise<any> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // Decode base64url signature
    const signatureB64 = parts[2].replace(/-/g, '+').replace(/_/g, '/');
    const signatureBytes = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
    
    const signatureValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(`${parts[0]}.${parts[1]}`)
    );
    
    if (!signatureValid) return null;
    
    // Decode payload
    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payloadB64));
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token não fornecido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const SOPH_JWT_SECRET = Deno.env.get('SOPH_JWT_SECRET')
    
    if (!SOPH_JWT_SECRET) {
      console.error('SOPH_JWT_SECRET não configurado')
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor incorreta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Validar JWT da Soph
    const payload = await verifyJWT(token, SOPH_JWT_SECRET)
    
    if (!payload) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Verificar origem e permissão
    if (payload.origem !== 'soph' || payload.permissao !== 'pricing_access') {
      return new Response(
        JSON.stringify({ error: 'Sem permissão de acesso' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar expiração
    if (Date.now() / 1000 > payload.exp) {
      return new Response(
        JSON.stringify({ error: 'Token expirado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Criar cliente Supabase com service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Gerar magic link para o usuário
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: payload.email,
      options: {
        redirectTo: 'https://aplicativodeprecificacao.lovable.app/'
      }
    })

    if (error) {
      console.error('Erro ao gerar magic link:', error)
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar sessão' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        redirect_url: data.properties?.action_link 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro interno:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
