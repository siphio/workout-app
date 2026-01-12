export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string | null
          default_sets: number
          display_order: number
          id: string
          name: string
          notes: string | null
          rest_seconds: number
          target_reps_max: number
          target_reps_min: number
          workout_type_id: string | null
        }
        Insert: {
          created_at?: string | null
          default_sets?: number
          display_order: number
          id?: string
          name: string
          notes?: string | null
          rest_seconds?: number
          target_reps_max?: number
          target_reps_min?: number
          workout_type_id?: string | null
        }
        Update: {
          created_at?: string | null
          default_sets?: number
          display_order?: number
          id?: string
          name?: string
          notes?: string | null
          rest_seconds?: number
          target_reps_max?: number
          target_reps_min?: number
          workout_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_type_id_fkey"
            columns: ["workout_type_id"]
            isOneToOne: false
            referencedRelation: "workout_types"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_weight: number | null
          exercise_id: string | null
          id: string
          is_completed: boolean | null
          target_date: string | null
          target_weight: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_weight?: number | null
          exercise_id?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          target_weight: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_weight?: number | null
          exercise_id?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          target_weight?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_records: {
        Row: {
          achieved_at: string
          created_at: string | null
          exercise_id: string | null
          id: string
          pr_type: string
          reps: number | null
          user_id: string | null
          value: number
          workout_log_id: string | null
        }
        Insert: {
          achieved_at?: string
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          pr_type: string
          reps?: number | null
          user_id?: string | null
          value: number
          workout_log_id?: string | null
        }
        Update: {
          achieved_at?: string
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          pr_type?: string
          reps?: number | null
          user_id?: string | null
          value?: number
          workout_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_state: {
        Row: {
          cycle_position: number | null
          id: string
          last_completed_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cycle_position?: number | null
          id?: string
          last_completed_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cycle_position?: number | null
          id?: string
          last_completed_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      set_logs: {
        Row: {
          completed_at: string | null
          exercise_id: string | null
          id: string
          is_pr: boolean | null
          notes: string | null
          reps: number
          set_number: number
          weight: number
          workout_log_id: string | null
        }
        Insert: {
          completed_at?: string | null
          exercise_id?: string | null
          id?: string
          is_pr?: boolean | null
          notes?: string | null
          reps: number
          set_number: number
          weight: number
          workout_log_id?: string | null
        }
        Update: {
          completed_at?: string | null
          exercise_id?: string | null
          id?: string
          is_pr?: boolean | null
          notes?: string | null
          reps?: number
          set_number?: number
          weight?: number
          workout_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "set_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          default_rest_seconds: number | null
          email: string | null
          id: string
          name: string
          rest_day_alerts_enabled: boolean | null
          timer_sound_enabled: boolean | null
          updated_at: string | null
          vibration_enabled: boolean | null
          weight_unit: string | null
          workout_reminders_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          default_rest_seconds?: number | null
          email?: string | null
          id?: string
          name?: string
          rest_day_alerts_enabled?: boolean | null
          timer_sound_enabled?: boolean | null
          updated_at?: string | null
          vibration_enabled?: boolean | null
          weight_unit?: string | null
          workout_reminders_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          default_rest_seconds?: number | null
          email?: string | null
          id?: string
          name?: string
          rest_day_alerts_enabled?: boolean | null
          timer_sound_enabled?: boolean | null
          updated_at?: string | null
          vibration_enabled?: boolean | null
          weight_unit?: string | null
          workout_reminders_enabled?: boolean | null
        }
        Relationships: []
      }
      weight_comparisons: {
        Row: {
          comparison_name: string
          created_at: string | null
          id: string
          image_filename: string
          max_weight: number
          min_weight: number
        }
        Insert: {
          comparison_name: string
          created_at?: string | null
          id?: string
          image_filename: string
          max_weight: number
          min_weight: number
        }
        Update: {
          comparison_name?: string
          created_at?: string | null
          id?: string
          image_filename?: string
          max_weight?: number
          min_weight?: number
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          notes: string | null
          started_at: string
          total_volume: number | null
          user_id: string | null
          workout_type_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          started_at?: string
          total_volume?: number | null
          user_id?: string | null
          workout_type_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          started_at?: string
          total_volume?: number | null
          user_id?: string | null
          workout_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_workout_type_id_fkey"
            columns: ["workout_type_id"]
            isOneToOne: false
            referencedRelation: "workout_types"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_types: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

