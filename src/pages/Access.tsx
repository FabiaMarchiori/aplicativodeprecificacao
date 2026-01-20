import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const SOPH_URL = 'https://empreendajacomsoph.netlify.app';

const Access = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'validating' | 'success' | 'error'>('validating');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setErrorMessage('Token de acesso não fornecido');
        setTimeout(() => {
          window.location.href = SOPH_URL;
        }, 2000);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('validate-access-token', {
          body: { token }
        });

        if (error || !data?.success) {
          setStatus('error');
          setErrorMessage(data?.error || 'Acesso não autorizado');
          setTimeout(() => {
            window.location.href = SOPH_URL;
          }, 2000);
          return;
        }

        // Marcar que o acesso foi autorizado pela Soph
        sessionStorage.setItem('soph_access_granted', 'true');
        sessionStorage.setItem('soph_access_time', Date.now().toString());
        
        setStatus('success');
        
        // Redirecionar para o magic link
        window.location.href = data.redirect_url;
        
      } catch (err) {
        console.error('Erro ao validar token:', err);
        setStatus('error');
        setErrorMessage('Erro de conexão');
        setTimeout(() => {
          window.location.href = SOPH_URL;
        }, 2000);
      }
    };

    validateToken();
  }, [searchParams]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'validating' && (
          <>
            <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#00D1FF', borderTopColor: 'transparent' }} 
            />
            <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Validando acesso...
            </span>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-10 h-10 border-2 rounded-full flex items-center justify-center"
              style={{ borderColor: '#00D1FF' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="#00D1FF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm" style={{ color: '#00D1FF' }}>
              Acesso autorizado! Redirecionando...
            </span>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-10 h-10 border-2 rounded-full flex items-center justify-center"
              style={{ borderColor: '#FF007A' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="#FF007A" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-sm" style={{ color: '#FF007A' }}>
              {errorMessage}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Redirecionando para a Soph...
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Access;
