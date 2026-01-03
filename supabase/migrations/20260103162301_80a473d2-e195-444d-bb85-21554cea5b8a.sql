-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_history ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- USER_ROLES policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- SUPPLIERS policies
CREATE POLICY "Users can view own suppliers"
  ON public.suppliers FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own suppliers"
  ON public.suppliers FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own suppliers"
  ON public.suppliers FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own suppliers"
  ON public.suppliers FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- PRODUCTS policies
CREATE POLICY "Users can view own products"
  ON public.products FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own products"
  ON public.products FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own products"
  ON public.products FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- FIXED_COSTS policies
CREATE POLICY "Users can view own fixed_costs"
  ON public.fixed_costs FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own fixed_costs"
  ON public.fixed_costs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own fixed_costs"
  ON public.fixed_costs FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own fixed_costs"
  ON public.fixed_costs FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- TAXES policies
CREATE POLICY "Users can view own taxes"
  ON public.taxes FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own taxes"
  ON public.taxes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own taxes"
  ON public.taxes FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own taxes"
  ON public.taxes FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- PRICING policies
CREATE POLICY "Users can view own pricing"
  ON public.pricing FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own pricing"
  ON public.pricing FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pricing"
  ON public.pricing FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own pricing"
  ON public.pricing FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- PRICING_HISTORY policies
CREATE POLICY "Users can view own pricing_history"
  ON public.pricing_history FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own pricing_history"
  ON public.pricing_history FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pricing_history"
  ON public.pricing_history FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own pricing_history"
  ON public.pricing_history FOR DELETE TO authenticated
  USING (user_id = auth.uid());