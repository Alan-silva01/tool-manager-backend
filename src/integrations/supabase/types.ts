export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ferramentas: {
        Row: {
          caracteristicas: Json | null
          categoria: string
          data_emprestado: string | null
          funcionario_emprestado: string | null
          id: string
          matricula: number | null
          nome: string
          quantidade: number
          saiu: number | null
          status: string | null
          tag: string
        }
        Insert: {
          caracteristicas?: Json | null
          categoria: string
          data_emprestado?: string | null
          funcionario_emprestado?: string | null
          id?: string
          matricula?: number | null
          nome: string
          quantidade: number
          saiu?: number | null
          status?: string | null
          tag: string
        }
        Update: {
          caracteristicas?: Json | null
          categoria?: string
          data_emprestado?: string | null
          funcionario_emprestado?: string | null
          id?: string
          matricula?: number | null
          nome?: string
          quantidade?: number
          saiu?: number | null
          status?: string | null
          tag?: string
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          id: string
          matricula: number
          nome: string
          numero_whatsapp: string | null
          posse_ferramentas: Json | null
          setor: Database["public"]["Enums"]["setor"]
        }
        Insert: {
          id?: string
          matricula: number
          nome: string
          numero_whatsapp?: string | null
          posse_ferramentas?: Json | null
          setor: Database["public"]["Enums"]["setor"]
        }
        Update: {
          id?: string
          matricula?: number
          nome?: string
          numero_whatsapp?: string | null
          posse_ferramentas?: Json | null
          setor?: Database["public"]["Enums"]["setor"]
        }
        Relationships: []
      }
      materiais: {
        Row: {
          data_entrada_estoque: string | null
          entrada: number
          id: string
          nome: string
          quantidade_minima: number
          saida: number
          tag: number | null
          unidade: string | null
        }
        Insert: {
          data_entrada_estoque?: string | null
          entrada: number
          id?: string
          nome: string
          quantidade_minima: number
          saida: number
          tag?: number | null
          unidade?: string | null
        }
        Update: {
          data_entrada_estoque?: string | null
          entrada?: number
          id?: string
          nome?: string
          quantidade_minima?: number
          saida?: number
          tag?: number | null
          unidade?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_materiais: {
        Args: {
          p_nome?: string
          p_tag?: number
          p_quant?: number
          p_data_entrada?: string
        }
        Returns: {
          nome: string
          quantidade_disponivel: number
          tag: number
        }[]
      }
      search_tools: {
        Args: {
          p_nome?: string
          p_tipo?: string
          p_status?: string
          p_quant?: number
          p_tag?: string
          p_caracteristicas?: string[]
          p_funcionario?: string
          p_matricula?: number
          p_data_emprestado?: string
          p_detalhado?: boolean
        }
        Returns: {
          nome: string
          tag: string
          quantidade_disponivel: number
          tipo: string
          status: string
          quantidade_total: number
          caracteristicas: Json
          id: string
          funcionario_emprestado: string
          matricula: number
          data_emprestado: string
        }[]
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      setor:
        | "Usinagem industrial"
        | "Oficina cantilever"
        | "Oficina de guias"
        | "Montagem de gaiola"
        | "Oficina de mancal"
        | "Usinagem de cilindros"
        | "Oficina central"
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
      setor: [
        "Usinagem industrial",
        "Oficina cantilever",
        "Oficina de guias",
        "Montagem de gaiola",
        "Oficina de mancal",
        "Usinagem de cilindros",
        "Oficina central",
      ],
    },
  },
} as const
