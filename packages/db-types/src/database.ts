
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "activity_log": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"id": number,"new_data": Json | null,"old_data": Json | null,"record_id": string,"shop_id": string,"table_name": string
                  }
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"id"?: never,"new_data"?: Json | null,"old_data"?: Json | null,"record_id": string,"shop_id": string,"table_name": string
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"id"?: never,"new_data"?: Json | null,"old_data"?: Json | null,"record_id"?: string,"shop_id"?: string,"table_name"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "activity_log_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "activity_log_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "shops"
      referencedColumns: ["id"]
    }
                  ]
                },"businesses": {
                  Row: {
                    "created_at": string,"id": string,"name": string,"status": Database["public"]['Enums']["business_status"],"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"name": string,"status"?: Database["public"]['Enums']["business_status"],"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"name"?: string,"status"?: Database["public"]['Enums']["business_status"],"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"entries": {
                  Row: {
                    "amount_paise": number,"bill_no": string | null,"created_at": string,"created_by": string,"deleted_at": string | null,"entry_date": string,"id": string,"note": string | null,"party_id": string,"shop_id": string,"type": Database["public"]['Enums']["entry_type"],"updated_at": string,"updated_by": string | null
                  }
                  Insert: {
                    "amount_paise"?: number,"bill_no"?: string | null,"created_at"?: string,"created_by"?: string,"deleted_at"?: string | null,"entry_date": string,"id"?: string,"note"?: string | null,"party_id": string,"shop_id": string,"type": Database["public"]['Enums']["entry_type"],"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "amount_paise"?: number,"bill_no"?: string | null,"created_at"?: string,"created_by"?: string,"deleted_at"?: string | null,"entry_date"?: string,"id"?: string,"note"?: string | null,"party_id"?: string,"shop_id"?: string,"type"?: Database["public"]['Enums']["entry_type"],"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "entries_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "entries_party_id_shop_id_fkey"
      columns: ["party_id","shop_id"]
isOneToOne: false
      referencedRelation: "parties"
      referencedColumns: ["id","shop_id"]
    },{
      foreignKeyName: "entries_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "shops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "entries_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"entry_items": {
                  Row: {
                    "entry_id": string,"id": string,"line_total_paise": number | null,"name": string,"position": number,"product_id": string | null,"qty": number,"rate_paise": number,"shop_id": string,"unit": Database["public"]['Enums']["product_unit"]
                  }
                  Insert: {
                    "entry_id": string,"id"?: string,"line_total_paise"?: never,"name": string,"position": number,"product_id"?: string | null,"qty": number,"rate_paise": number,"shop_id": string,"unit": Database["public"]['Enums']["product_unit"]
                  }
                  Update: {
                    "entry_id"?: string,"id"?: string,"line_total_paise"?: never,"name"?: string,"position"?: number,"product_id"?: string | null,"qty"?: number,"rate_paise"?: number,"shop_id"?: string,"unit"?: Database["public"]['Enums']["product_unit"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "entry_items_entry_id_shop_id_fkey"
      columns: ["entry_id","shop_id"]
isOneToOne: false
      referencedRelation: "entries"
      referencedColumns: ["id","shop_id"]
    },{
      foreignKeyName: "entry_items_product_id_shop_id_fkey"
      columns: ["product_id","shop_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id","shop_id"]
    }
                  ]
                },"parties": {
                  Row: {
                    "created_at": string,"created_by": string,"deleted_at": string | null,"id": string,"kind": Database["public"]['Enums']["party_kind"],"name": string,"phone": string | null,"shop_id": string,"updated_at": string,"updated_by": string | null
                  }
                  Insert: {
                    "created_at"?: string,"created_by"?: string,"deleted_at"?: string | null,"id"?: string,"kind"?: Database["public"]['Enums']["party_kind"],"name": string,"phone"?: string | null,"shop_id": string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string,"deleted_at"?: string | null,"id"?: string,"kind"?: Database["public"]['Enums']["party_kind"],"name"?: string,"phone"?: string | null,"shop_id"?: string,"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "parties_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "parties_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "shops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "parties_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"products": {
                  Row: {
                    "created_at": string,"created_by": string,"deleted_at": string | null,"id": string,"name": string,"rate_paise": number,"shop_id": string,"unit": Database["public"]['Enums']["product_unit"],"updated_at": string,"updated_by": string | null
                  }
                  Insert: {
                    "created_at"?: string,"created_by"?: string,"deleted_at"?: string | null,"id"?: string,"name": string,"rate_paise": number,"shop_id": string,"unit"?: Database["public"]['Enums']["product_unit"],"updated_at"?: string,"updated_by"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string,"deleted_at"?: string | null,"id"?: string,"name"?: string,"rate_paise"?: number,"shop_id"?: string,"unit"?: Database["public"]['Enums']["product_unit"],"updated_at"?: string,"updated_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "products_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "products_shop_id_fkey"
      columns: ["shop_id"]
isOneToOne: false
      referencedRelation: "shops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "products_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"display_name": string,"id": string,"is_active": boolean,"must_change_password": boolean,"updated_at": string,"username": string
                  }
                  Insert: {
                    "created_at"?: string,"display_name": string,"id": string,"is_active"?: boolean,"must_change_password"?: boolean,"updated_at"?: string,"username": string
                  }
                  Update: {
                    "created_at"?: string,"display_name"?: string,"id"?: string,"is_active"?: boolean,"must_change_password"?: boolean,"updated_at"?: string,"username"?: string
                  }
                  Relationships: [
                    
                  ]
                },"shops": {
                  Row: {
                    "business_id": string,"created_at": string,"id": string,"name": string,"shop_code": string,"status": Database["public"]['Enums']["shop_status"],"timezone": string,"updated_at": string
                  }
                  Insert: {
                    "business_id": string,"created_at"?: string,"id"?: string,"name": string,"shop_code": string,"status"?: Database["public"]['Enums']["shop_status"],"timezone"?: string,"updated_at"?: string
                  }
                  Update: {
                    "business_id"?: string,"created_at"?: string,"id"?: string,"name"?: string,"shop_code"?: string,"status"?: Database["public"]['Enums']["shop_status"],"timezone"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "shops_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"user_roles": {
                  Row: {
                    "business_id": string | null,"created_at": string,"role": Database["public"]['Enums']["app_role"],"shop_id": string | null,"user_id": string
                  }
                  Insert: {
                    "business_id"?: string | null,"created_at"?: string,"role": Database["public"]['Enums']["app_role"],"shop_id"?: string | null,"user_id": string
                  }
                  Update: {
                    "business_id"?: string | null,"created_at"?: string,"role"?: Database["public"]['Enums']["app_role"],"shop_id"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "user_roles_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "user_roles_shop_id_business_id_fkey"
      columns: ["shop_id","business_id"]
isOneToOne: false
      referencedRelation: "shops"
      referencedColumns: ["id","business_id"]
    },{
      foreignKeyName: "user_roles_user_id_fkey"
      columns: ["user_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "custom_access_token_hook":
{ Args: { "event": Json }; Returns: Json
                           }
          }
          Enums: {
            "app_role": "super_admin"|"admin"|"employee","business_status": "active"|"suspended","entry_type": "sale"|"purchase","party_kind": "customer"|"supplier"|"both","product_unit": "pcs"|"kg"|"g"|"litre"|"ml"|"dozen"|"box"|"packet"|"tray","shop_status": "active"|"inactive"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "app_role": ["super_admin", "admin", "employee"],"business_status": ["active", "suspended"],"entry_type": ["sale", "purchase"],"party_kind": ["customer", "supplier", "both"],"product_unit": ["pcs", "kg", "g", "litre", "ml", "dozen", "box", "packet", "tray"],"shop_status": ["active", "inactive"]
          }
        }
} as const
