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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ferramentas: {
        Row: {
          caracteristicas: Json | null
          categoria: string | null
          data_emprestado: string | null
          funcionario_emprestado: string | null
          id: string
          matricula: number | null
          matricula_reserva: string | null
          nome: string | null
          quantidade: number | null
          reserva: boolean | null
          saiu: number | null
          status: string | null
          tag: string
        }
        Insert: {
          caracteristicas?: Json | null
          categoria?: string | null
          data_emprestado?: string | null
          funcionario_emprestado?: string | null
          id?: string
          matricula?: number | null
          matricula_reserva?: string | null
          nome?: string | null
          quantidade?: number | null
          reserva?: boolean | null
          saiu?: number | null
          status?: string | null
          tag: string
        }
        Update: {
          caracteristicas?: Json | null
          categoria?: string | null
          data_emprestado?: string | null
          funcionario_emprestado?: string | null
          id?: string
          matricula?: number | null
          matricula_reserva?: string | null
          nome?: string | null
          quantidade?: number | null
          reserva?: boolean | null
          saiu?: number | null
          status?: string | null
          tag?: string
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          cod_nfc: number | null
          id: string
          matricula: number
          nome: string
          numero_whatsapp: string | null
          posse_ferramentas: Json | null
          setor: Database["public"]["Enums"]["setor"]
        }
        Insert: {
          cod_nfc?: number | null
          id?: string
          matricula: number
          nome: string
          numero_whatsapp?: string | null
          posse_ferramentas?: Json | null
          setor: Database["public"]["Enums"]["setor"]
        }
        Update: {
          cod_nfc?: number | null
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
          estoque_baixo: boolean | null
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
          estoque_baixo?: boolean | null
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
          estoque_baixo?: boolean | null
          id?: string
          nome?: string
          quantidade_minima?: number
          saida?: number
          tag?: number | null
          unidade?: string | null
        }
        Relationships: []
      }
      n8n_chat_avb: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      registro_mate_funcionarios: {
        Row: {
          data: string | null
          funcionario: string | null
          id: string
          material: string | null
          matricula: string | null
          quantidade: number | null
        }
        Insert: {
          data?: string | null
          funcionario?: string | null
          id?: string
          material?: string | null
          matricula?: string | null
          quantidade?: number | null
        }
        Update: {
          data?: string | null
          funcionario?: string | null
          id?: string
          material?: string | null
          matricula?: string | null
          quantidade?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { data: Json; uri: string } | { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { content: string; content_type: string; uri: string }
          | { data: Json; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      search_materiais: {
        Args: {
          p_data_entrada?: string
          p_estoque_baixo?: boolean
          p_nome?: string
          p_quant?: number
          p_tag?: number
        }
        Returns: {
          nome: string
          quantidade_disponivel: number
          tag: number
        }[]
      }
      search_tools: {
        Args: {
          p_caracteristicas?: string[]
          p_data_emprestado?: string
          p_detalhado?: boolean
          p_funcionario?: string
          p_matricula?: number
          p_matricula_reserva?: string
          p_nome?: string
          p_quant?: number
          p_reserva?: boolean
          p_status?: string
          p_tag?: string
          p_tipo?: string
        }
        Returns: {
          caracteristicas: Json
          data_emprestado: string
          funcionario_emprestado: string
          id: string
          matricula: number
          matricula_reserva: string
          nome: string
          quantidade_disponivel: number
          quantidade_total: number
          reserva: boolean
          status: string
          tag: string
          tipo: string
        }[]
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
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
        | "Outro"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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
        "Outro",
      ],
    },
  },
} as const
