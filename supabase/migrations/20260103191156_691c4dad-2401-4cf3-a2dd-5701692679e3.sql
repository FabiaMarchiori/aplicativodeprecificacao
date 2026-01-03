-- Desativar RLS
ALTER TABLE public.suppliers DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can view own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can insert own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can update own suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can delete own suppliers" ON public.suppliers;

-- Renomear colunas
ALTER TABLE public.suppliers RENAME COLUMN nome TO name;
ALTER TABLE public.suppliers RENAME COLUMN prazo_medio_dias TO average_delivery_time_days;
ALTER TABLE public.suppliers RENAME COLUMN custo_logistico TO logistic_cost;
ALTER TABLE public.suppliers RENAME COLUMN observacoes TO notes;

-- Alterar tipo de 'tipo' (enum) para 'type' (text)
ALTER TABLE public.suppliers 
  ADD COLUMN type text DEFAULT 'national';

UPDATE public.suppliers 
SET type = CASE 
  WHEN tipo = 'nacional' THEN 'national'
  WHEN tipo = 'importado' THEN 'imported'
  ELSE 'national'
END;

ALTER TABLE public.suppliers DROP COLUMN tipo;