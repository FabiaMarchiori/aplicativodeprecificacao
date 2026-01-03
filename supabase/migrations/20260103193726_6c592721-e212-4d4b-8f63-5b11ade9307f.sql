-- Ativar RLS na tabela suppliers
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: usuário vê apenas seus fornecedores
CREATE POLICY "Users can view own suppliers"
ON public.suppliers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Política de INSERT: usuário só insere com seu próprio user_id
CREATE POLICY "Users can insert own suppliers"
ON public.suppliers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Política de UPDATE: usuário só atualiza seus fornecedores
CREATE POLICY "Users can update own suppliers"
ON public.suppliers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Política de DELETE: usuário só exclui seus fornecedores
CREATE POLICY "Users can delete own suppliers"
ON public.suppliers
FOR DELETE
TO authenticated
USING (user_id = auth.uid());