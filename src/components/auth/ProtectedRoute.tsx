import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

const SOPH_URL = 'https://empreendajacomsoph.netlify.app';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Verificar autorização da Soph
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

  // Sem autorização da Soph - redireciona para Soph
  if (!hasAccess) {
    window.location.href = SOPH_URL;
    return null;
  }

  // Sem usuário autenticado - redireciona para Soph (NÃO para /auth)
  if (!user) {
    window.location.href = SOPH_URL;
    return null;
  }

  // Usuário autenticado e autorizado - renderiza conteúdo protegido
  return <>{children}</>;
};
