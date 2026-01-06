import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');

type AuthMode = 'login' | 'signup' | 'reset';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = (emailOnly = false) => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    if (!emailOnly) {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'reset') {
      if (!validateForm(true)) return;
      
      setLoading(true);
      try {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: 'Erro ao enviar',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Email enviado!',
            description: 'Verifique sua caixa de entrada para redefinir sua senha.',
          });
          setMode('login');
          setEmail('');
        }
      } finally {
        setLoading(false);
      }
      return;
    }
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Erro ao entrar',
              description: 'Email ou senha incorretos.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Erro ao entrar',
              description: error.message,
              variant: 'destructive',
            });
          }
        }
      } else {
        const { error } = await signUp(email, password, nome);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Erro ao cadastrar',
              description: 'Este email já está cadastrado. Tente fazer login.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Erro ao cadastrar',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Cadastro realizado!',
            description: 'Verifique seu email para confirmar o cadastro.',
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: 'Erro ao entrar com Google',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      }}
    >
      <Card 
        className="w-full max-w-md border-0"
        style={{
          background: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(0, 209, 255, 0.1), 0 0 80px rgba(255, 0, 122, 0.05)',
          border: '1px solid rgba(0, 209, 255, 0.2)',
        }}
      >
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #FF007A, #00D1FF)',
                boxShadow: '0 0 20px rgba(255, 0, 122, 0.5), 0 0 40px rgba(0, 209, 255, 0.3)'
              }}
            >
              <TrendingUp 
                className="w-8 h-8" 
                style={{ 
                  color: '#FFFFFF', 
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))' 
                }} 
              />
            </div>
          </div>
          <CardTitle 
            className="text-2xl font-bold"
            style={{ 
              color: '#00D1FF',
              textShadow: '0 0 20px rgba(0, 209, 255, 0.5)'
            }}
          >
            {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar Conta' : 'Recuperar Senha'}
          </CardTitle>
          <CardDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {mode === 'login' 
              ? 'Acesse sua conta para gerenciar preços' 
              : mode === 'signup'
              ? 'Crie sua conta para começar'
              : 'Digite seu email para receber o link de recuperação'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="nome" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Nome
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0, 209, 255, 0.6)' }} />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-10 border-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      borderBottom: '1px solid rgba(0, 209, 255, 0.3)',
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0, 209, 255, 0.6)' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  className="pl-10 border-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    borderBottom: errors.email 
                      ? '1px solid rgba(255, 0, 122, 0.8)' 
                      : '1px solid rgba(0, 209, 255, 0.3)',
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-sm" style={{ color: '#FF007A' }}>{errors.email}</p>
              )}
            </div>
            
            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0, 209, 255, 0.6)' }} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className="pl-10 border-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      borderBottom: errors.password 
                        ? '1px solid rgba(255, 0, 122, 0.8)' 
                        : '1px solid rgba(0, 209, 255, 0.3)',
                    }}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm" style={{ color: '#FF007A' }}>{errors.password}</p>
                )}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full border-0 font-semibold text-base py-6"
              style={{
                background: 'linear-gradient(135deg, #FF007A, #00D1FF)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(255, 0, 122, 0.3), 0 0 40px rgba(0, 209, 255, 0.2)',
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                'Entrar'
              ) : mode === 'signup' ? (
                'Criar Conta'
              ) : (
                'Enviar Link'
              )}
            </Button>
            
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="w-full mt-2 text-sm transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                Esqueci minha senha
              </button>
            )}
          </form>

          {/* Separador e Botão Google */}
          {mode !== 'reset' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2" style={{ background: 'rgba(10, 10, 10, 0.9)', color: 'rgba(255,255,255,0.5)' }}>
                    ou continue com
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-6 font-medium"
                style={{
                  background: '#fff',
                  color: '#1f1f1f',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Entrar com Google
                  </>
                )}
              </Button>
            </>
          )}
          
          <div className="mt-6 text-center">
            {mode === 'reset' ? (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm transition-colors"
                style={{ color: 'rgba(0, 209, 255, 0.8)' }}
              >
                ← Voltar para login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm transition-colors"
                style={{ color: 'rgba(0, 209, 255, 0.8)' }}
              >
                {mode === 'login' ? (
                  <>Não tem conta? <span style={{ color: '#00D1FF' }}>Cadastre-se</span></>
                ) : (
                  <>Já tem conta? <span style={{ color: '#00D1FF' }}>Entrar</span></>
                )}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
