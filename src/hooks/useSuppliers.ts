import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Supplier } from '@/data/mockData';

interface SupplierRow {
  id: string;
  user_id: string;
  name: string;
  type: string | null;
  average_delivery_time_days: number | null;
  logistic_cost: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Mapeia dados do Supabase para o formato do frontend
const mapRowToSupplier = (row: SupplierRow): Supplier => ({
  id: row.id,
  name: row.name,
  type: (row.type === 'imported' ? 'imported' : 'national') as 'national' | 'imported',
  averageDeliveryDays: row.average_delivery_time_days ?? 0,
  averageLogisticsCost: row.logistic_cost ?? 0,
  notes: row.notes ?? '',
});

// Mapeia dados do frontend para o formato do Supabase
const mapSupplierToRow = (
  supplier: Omit<Supplier, 'id'>,
  userId: string
): Omit<SupplierRow, 'id' | 'created_at' | 'updated_at'> => ({
  user_id: userId,
  name: supplier.name,
  type: supplier.type,
  average_delivery_time_days: supplier.averageDeliveryDays,
  logistic_cost: supplier.averageLogisticsCost,
  notes: supplier.notes || null,
});

export const useSuppliers = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch suppliers
  const fetchSuppliers = useCallback(async () => {
    if (!user) {
      setSuppliers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mapped = (data || []).map(row => mapRowToSupplier(row as SupplierRow));
      setSuppliers(mapped);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add supplier
  const addSupplier = useCallback(async (supplier: Omit<Supplier, 'id'>): Promise<Supplier | null> => {
    if (!user) return null;

    try {
      const rowData = mapSupplierToRow(supplier, user.id);

      const { data, error: insertError } = await supabase
        .from('suppliers')
        .insert(rowData)
        .select()
        .single();

      if (insertError) throw insertError;

      const newSupplier = mapRowToSupplier(data as SupplierRow);
      setSuppliers(prev => [newSupplier, ...prev]);
      return newSupplier;
    } catch (err) {
      console.error('Erro ao adicionar fornecedor:', err);
      throw err;
    }
  }, [user]);

  // Update supplier
  const updateSupplier = useCallback(async (id: string, data: Partial<Supplier>): Promise<void> => {
    if (!user) return;

    try {
      const updateData: Record<string, unknown> = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.averageDeliveryDays !== undefined) updateData.average_delivery_time_days = data.averageDeliveryDays;
      if (data.averageLogisticsCost !== undefined) updateData.logistic_cost = data.averageLogisticsCost;
      if (data.notes !== undefined) updateData.notes = data.notes || null;

      const { error: updateError } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setSuppliers(prev => prev.map(s => 
        s.id === id ? { ...s, ...data } : s
      ));
    } catch (err) {
      console.error('Erro ao atualizar fornecedor:', err);
      throw err;
    }
  }, [user]);

  // Delete supplier
  const deleteSupplier = useCallback(async (id: string): Promise<void> => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Erro ao excluir fornecedor:', err);
      throw err;
    }
  }, [user]);

  // Load suppliers on mount and when user changes
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refetch: fetchSuppliers,
  };
};
