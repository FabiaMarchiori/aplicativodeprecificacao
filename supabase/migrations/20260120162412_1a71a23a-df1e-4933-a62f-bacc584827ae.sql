-- Tabela para controlar permissões de apps
CREATE TABLE public.app_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    app_name TEXT NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    source TEXT NOT NULL DEFAULT 'soph',
    UNIQUE (user_id, app_name)
);

-- Habilitar RLS
ALTER TABLE public.app_permissions ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ler suas próprias permissões
CREATE POLICY "Users can read own permissions"
ON public.app_permissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);