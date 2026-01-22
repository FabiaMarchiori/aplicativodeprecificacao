import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const SOPH_URL = 'https://empreendajacomsoph.netlify.app';

// Verificar se está no ambiente de desenvolvimento (Lovable preview ou localhost)
const isDevEnvironment = () => {
  const hostname = window.location.hostname;
  return hostname.includes('lovable.app') || hostname === 'localhost';
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  
  const isDev = isDevEnvironment();
  const hasAccess = sessionStorage.getItem('soph_access_granted');

  // Estado de loading - renderiza spinner enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  // Em produção: verificar acesso da Soph
  if (!isDev && !hasAccess) {
    window.location.href = SOPH_URL;
    return null;
  }

  // Sem usuário autenticado
  if (!user) {
    // Em dev: redirecionar para /auth local
    if (isDev) {
      return <Navigate to="/auth" replace />;
    }
    // Em prod: redirecionar para Soph
    window.location.href = SOPH_URL;
    return null;
  }

  // Usuário autenticado e autorizado - renderiza conteúdo protegido
  return <>{children}</>;
};
