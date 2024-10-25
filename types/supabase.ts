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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      articles: {
        Row: {
          author: string | null
          body: Json
          created_at: string
          id: number
          status: Database['public']['Enums']['article-status']
          title: string | null
          title_slug: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          body: Json
          created_at?: string
          id?: number
          status?: Database['public']['Enums']['article-status']
          title?: string | null
          title_slug: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          body?: Json
          created_at?: string
          id?: number
          status?: Database['public']['Enums']['article-status']
          title?: string | null
          title_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'articles_author_fkey'
            columns: ['author']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          }
        ]
      }
      comments: {
        Row: {
          attachments: Json | null
          author: string
          created_at: string
          id: number
          text: string | null
        }
        Insert: {
          attachments?: Json | null
          author: string
          created_at?: string
          id?: number
          text?: string | null
        }
        Update: {
          attachments?: Json | null
          author?: string
          created_at?: string
          id?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_author_fkey'
            columns: ['author']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          }
        ]
      }
      media_files: {
        Row: {
          description: string | null
          duration: number | null
          file: string
          height: number
          id: number
          mime_type: string
          name: string
          thumbnail: number | null
          uploaded_at: string
          uploaded_by: string | null
          url: string
          width: number
        }
        Insert: {
          description?: string | null
          duration?: number | null
          file: string
          height: number
          id?: number
          mime_type: string
          name: string
          thumbnail?: number | null
          uploaded_at?: string
          uploaded_by?: string | null
          url: string
          width: number
        }
        Update: {
          description?: string | null
          duration?: number | null
          file?: string
          height?: number
          id?: number
          mime_type?: string
          name?: string
          thumbnail?: number | null
          uploaded_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: 'media_files_file_fkey'
            columns: ['file']
            isOneToOne: false
            referencedRelation: 'objects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'media_files_thumbnail_fkey'
            columns: ['thumbnail']
            isOneToOne: false
            referencedRelation: 'media_files'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'media_files_uploaded_by_fkey'
            columns: ['uploaded_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          }
        ]
      }
      profiles: {
        Row: {
          articles: number
          avatar_url: string | null
          created_at: string
          email: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          articles?: number
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: number
          name?: string
          user_id?: string
        }
        Update: {
          articles?: number
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      'article-status': 'draft' | 'published' | 'scheduled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never
