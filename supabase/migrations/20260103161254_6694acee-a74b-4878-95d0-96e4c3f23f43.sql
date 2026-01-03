-- =============================================
-- APLICATIVO DE PRECIFICAÇÃO - ESTRUTURA COMPLETA
-- =============================================

-- 1. CRIAR ENUMS PERSONALIZADOS
-- =============================================
CREATE TYPE public.supplier_type AS ENUM ('nacional', 'importado');
CREATE TYPE public.product_status AS ENUM ('ativo', 'inativo');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. CRIAR TABELAS
-- =============================================

-- 2.1 Profiles (Perfil do Usuário)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  empresa TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 User Roles (Papéis de Usuário)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 2.3 Suppliers (Fornecedores)
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo public.supplier_type NOT NULL DEFAULT 'nacional',
  prazo_medio_dias INTEGER DEFAULT 0,
  custo_logistico NUMERIC(12,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Products (Produtos)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT,
  fornecedor_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  unidade TEXT DEFAULT 'UN',
  custo_compra NUMERIC(12,2) DEFAULT 0,
  custo_variavel NUMERIC(12,2) DEFAULT 0,
  preco_venda NUMERIC(12,2) DEFAULT 0,
  status public.product_status DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 Fixed Costs (Custos Fixos)
CREATE TABLE public.fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_custo TEXT NOT NULL,
  valor_mensal NUMERIC(12,2) DEFAULT 0,
  rateio_percentual NUMERIC(5,2) DEFAULT 0,
  valor_rateado NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 Taxes (Impostos e Taxas)
CREATE TABLE public.taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  imposto_sobre_venda NUMERIC(5,2) DEFAULT 0,
  taxa_marketplace NUMERIC(5,2) DEFAULT 0,
  taxa_cartao NUMERIC(5,2) DEFAULT 0,
  outras_taxas NUMERIC(5,2) DEFAULT 0,
  taxa_total NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 Pricing (Precificação)
CREATE TABLE public.pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  custo_total NUMERIC(12,2) DEFAULT 0,
  impostos NUMERIC(12,2) DEFAULT 0,
  margem_desejada NUMERIC(5,2) DEFAULT 30,
  desconto NUMERIC(5,2) DEFAULT 0,
  preco_sugerido NUMERIC(12,2) DEFAULT 0,
  lucro_unitario NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, produto_id)
);

-- 2.8 Pricing History (Histórico de Preços)
CREATE TABLE public.pricing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  preco_anterior NUMERIC(12,2),
  preco_novo NUMERIC(12,2),
  motivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FUNÇÃO PARA ATUALIZAR updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_fixed_costs_updated_at
  BEFORE UPDATE ON public.fixed_costs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_taxes_updated_at
  BEFORE UPDATE ON public.taxes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_pricing_updated_at
  BEFORE UPDATE ON public.pricing
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. FUNÇÃO E TRIGGER PARA NOVO USUÁRIO
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'nome');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. FUNÇÃO DE VERIFICAÇÃO DE PAPEL (SEGURANÇA)
-- =============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_fornecedor_id ON public.products(fornecedor_id);
CREATE INDEX idx_fixed_costs_user_id ON public.fixed_costs(user_id);
CREATE INDEX idx_pricing_user_id ON public.pricing(user_id);
CREATE INDEX idx_pricing_produto_id ON public.pricing(produto_id);
CREATE INDEX idx_pricing_history_user_id ON public.pricing_history(user_id);
CREATE INDEX idx_pricing_history_produto_id ON public.pricing_history(produto_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);