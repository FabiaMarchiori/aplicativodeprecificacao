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
  
  const { signIn, signUp, resetPassword } = useAuth();
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
