export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      fixed_costs: {
        Row: {
          created_at: string
          id: string
          rateio_percentual: number | null
          tipo_custo: string
          updated_at: string
          user_id: string
          valor_mensal: number | null
          valor_rateado: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          rateio_percentual?: number | null
          tipo_custo: string
          updated_at?: string
          user_id: string
          valor_mensal?: number | null
          valor_rateado?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          rateio_percentual?: number | null
          tipo_custo?: string
          updated_at?: string
          user_id?: string
          valor_mensal?: number | null
          valor_rateado?: number | null
        }
        Relationships: []
      }
      pricing: {
        Row: {
          created_at: string
          custo_total: number | null
          desconto: number | null
          id: string
          impostos: number | null
          lucro_unitario: number | null
          margem_desejada: number | null
          preco_sugerido: number | null
          produto_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custo_total?: number | null
          desconto?: number | null
          id?: string
          impostos?: number | null
          lucro_unitario?: number | null
          margem_desejada?: number | null
          preco_sugerido?: number | null
          produto_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custo_total?: number | null
          desconto?: number | null
          id?: string
          impostos?: number | null
          lucro_unitario?: number | null
          margem_desejada?: number | null
          preco_sugerido?: number | null
          produto_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_history: {
        Row: {
          created_at: string
          id: string
          motivo: string | null
          preco_anterior: number | null
          preco_novo: number | null
          produto_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          motivo?: string | null
          preco_anterior?: number | null
          preco_novo?: number | null
          produto_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          motivo?: string | null
          preco_anterior?: number | null
          preco_novo?: number | null
          produto_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_history_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          categoria: string | null
          codigo: string
          created_at: string
          custo_compra: number | null
          custo_variavel: number | null
          fornecedor_id: string | null
          id: string
          nome: string
          preco_venda: number | null
          status: Database["public"]["Enums"]["product_status"] | null
          unidade: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          codigo: string
          created_at?: string
          custo_compra?: number | null
          custo_variavel?: number | null
          fornecedor_id?: string | null
          id?: string
          nome: string
          preco_venda?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          unidade?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          codigo?: string
          created_at?: string
          custo_compra?: number | null
          custo_variavel?: number | null
          fornecedor_id?: string | null
          id?: string
          nome?: string
          preco_venda?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          unidade?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          empresa: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          empresa?: string | null
          id: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          created_at: string
          custo_logistico: number | null
          id: string
          nome: string
          observacoes: string | null
          prazo_medio_dias: number | null
          tipo: Database["public"]["Enums"]["supplier_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custo_logistico?: number | null
          id?: string
          nome: string
          observacoes?: string | null
          prazo_medio_dias?: number | null
          tipo?: Database["public"]["Enums"]["supplier_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custo_logistico?: number | null
          id?: string
          nome?: string
          observacoes?: string | null
          prazo_medio_dias?: number | null
          tipo?: Database["public"]["Enums"]["supplier_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      taxes: {
        Row: {
          created_at: string
          id: string
          imposto_sobre_venda: number | null
          outras_taxas: number | null
          taxa_cartao: number | null
          taxa_marketplace: number | null
          taxa_total: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          imposto_sobre_venda?: number | null
          outras_taxas?: number | null
          taxa_cartao?: number | null
          taxa_marketplace?: number | null
          taxa_total?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          imposto_sobre_venda?: number | null
          outras_taxas?: number | null
          taxa_cartao?: number | null
          taxa_marketplace?: number | null
          taxa_total?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      product_status: "ativo" | "inativo"
      supplier_type: "nacional" | "importado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      product_status: ["ativo", "inativo"],
      supplier_type: ["nacional", "importado"],
    },
  },
} as const
