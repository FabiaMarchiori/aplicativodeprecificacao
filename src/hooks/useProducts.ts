import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/data/mockData';

interface ProductRow {
  id: string;
  user_id: string;
  codigo: string;
  nome: string;
  categoria: string | null;
  fornecedor_id: string | null;
  custo_compra: number | null;
  custo_variavel: number | null;
  preco_venda: number | null;
  status: 'ativo' | 'inativo' | null;
  unidade: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductRowWithSupplier extends ProductRow {
  suppliers: { name: string } | null;
}

// Mapeia dados do Supabase para o formato do frontend
const mapRowToProduct = (row: ProductRowWithSupplier): Product => ({
  id: row.id,
  code: row.codigo,
  name: row.nome,
  category: row.categoria ?? '',
  supplier: row.suppliers?.name ?? '',
  unit: row.unidade ?? 'UN',
  purchaseCost: row.custo_compra ?? 0,
  variableCost: row.custo_variavel ?? 0,
  currentPrice: row.preco_venda ?? 0,
  status: row.status === 'inativo' ? 'inactive' : 'active',
});

// Mapeia dados do frontend para o formato do Supabase
const mapProductToRow = (
  product: Omit<Product, 'id'>,
  userId: string,
  supplierId: string | null
): Omit<ProductRow, 'id' | 'created_at' | 'updated_at' | 'suppliers'> => ({
  user_id: userId,
  codigo: product.code,
  nome: product.name,
  categoria: product.category || null,
  fornecedor_id: supplierId,
  custo_compra: product.purchaseCost,
  custo_variavel: product.variableCost,
  preco_venda: product.currentPrice,
  status: product.status === 'inactive' ? 'inativo' : 'ativo',
  unidade: product.unit || 'UN',
});

export const useProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca o ID do fornecedor pelo nome
  const findSupplierIdByName = useCallback(async (supplierName: string): Promise<string | null> => {
    if (!user || !supplierName) return null;

    const { data } = await supabase
      .from('suppliers')
      .select('id')
      .eq('user_id', user.id)
      .ilike('name', supplierName)
      .limit(1)
      .single();

    return data?.id ?? null;
  }, [user]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          suppliers:fornecedor_id (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mapped = (data || []).map(row => mapRowToProduct(row as ProductRowWithSupplier));
      setProducts(mapped);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add product
  const addProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    if (!user) return null;

    try {
      // Buscar ID do fornecedor pelo nome
      const supplierId = await findSupplierIdByName(product.supplier);
      const rowData = mapProductToRow(product, user.id, supplierId);

      const { data, error: insertError } = await supabase
        .from('products')
        .insert(rowData)
        .select(`
          *,
          suppliers:fornecedor_id (name)
        `)
        .single();

      if (insertError) throw insertError;

      const newProduct = mapRowToProduct(data as ProductRowWithSupplier);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      throw err;
    }
  }, [user, findSupplierIdByName]);

  // Update product
  const updateProduct = useCallback(async (id: string, data: Partial<Product>): Promise<void> => {
    if (!user) return;

    try {
      const updateData: Record<string, unknown> = {};

      if (data.code !== undefined) updateData.codigo = data.code;
      if (data.name !== undefined) updateData.nome = data.name;
      if (data.category !== undefined) updateData.categoria = data.category || null;
      if (data.unit !== undefined) updateData.unidade = data.unit || 'UN';
      if (data.purchaseCost !== undefined) updateData.custo_compra = data.purchaseCost;
      if (data.variableCost !== undefined) updateData.custo_variavel = data.variableCost;
      if (data.currentPrice !== undefined) updateData.preco_venda = data.currentPrice;
      if (data.status !== undefined) updateData.status = data.status === 'inactive' ? 'inativo' : 'ativo';

      // Se o fornecedor foi alterado, buscar o ID
      if (data.supplier !== undefined) {
        const supplierId = await findSupplierIdByName(data.supplier);
        updateData.fornecedor_id = supplierId;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProducts(prev => prev.map(p =>
        p.id === id ? { ...p, ...data } : p
      ));
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      throw err;
    }
  }, [user, findSupplierIdByName]);

  // Delete product
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      throw err;
    }
  }, [user]);

  // Load products on mount and when user changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
