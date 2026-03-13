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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      match_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          match_id: string
          minute: number
          player_in: string | null
          player_name: string | null
          player_out: string | null
          team_id: string | null
          type: Database["public"]["Enums"]["match_event_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          match_id: string
          minute: number
          player_in?: string | null
          player_name?: string | null
          player_out?: string | null
          team_id?: string | null
          type: Database["public"]["Enums"]["match_event_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          match_id?: string
          minute?: number
          player_in?: string | null
          player_name?: string | null
          player_out?: string | null
          team_id?: string | null
          type?: Database["public"]["Enums"]["match_event_type"]
        }
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      match_referees: {
        Row: {
          id: string
          match_id: string
          referee_id: string
          role: Database["public"]["Enums"]["referee_role"]
        }
        Insert: {
          id?: string
          match_id: string
          referee_id: string
          role?: Database["public"]["Enums"]["referee_role"]
        }
        Update: {
          id?: string
          match_id?: string
          referee_id?: string
          role?: Database["public"]["Enums"]["referee_role"]
        }
        Relationships: [
          {
            foreignKeyName: "match_referees_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_referees_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "referees"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_url: string | null
          payment_method: string | null
          receipt_url: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          team_id: string | null
          tournament_id: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_url?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          team_id?: string | null
          tournament_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_url?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          team_id?: string | null
          tournament_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number
          away_team_id: string | null
          created_at: string
          date_time: string | null
          home_score: number
          home_team_id: string | null
          id: string
          minute: number | null
          organization_id: string
          round: string | null
          stats: Json | null
          status: Database["public"]["Enums"]["match_status"]
          tournament_id: string
          updated_at: string
          venue_id: string | null
          weather: Json | null
        }
        Insert: {
          away_score?: number
          away_team_id?: string | null
          created_at?: string
          date_time?: string | null
          home_score?: number
          home_team_id?: string | null
          id?: string
          minute?: number | null
          organization_id: string
          round?: string | null
          stats?: Json | null
          status?: Database["public"]["Enums"]["match_status"]
          tournament_id: string
          updated_at?: string
          venue_id?: string | null
          weather?: Json | null
        }
        Update: {
          away_score?: number
          away_team_id?: string | null
          created_at?: string
          date_time?: string | null
          home_score?: number
          home_team_id?: string | null
          id?: string
          minute?: number | null
          organization_id?: string
          round?: string | null
          stats?: Json | null
          status?: Database["public"]["Enums"]["match_status"]
          tournament_id?: string
          updated_at?: string
          venue_id?: string | null
          weather?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          file_path: string
          file_type: string | null
          id: string
          name: string
          organization_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          file_path: string
          file_type?: string | null
          id?: string
          name: string
          organization_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          file_path?: string
          file_type?: string | null
          id?: string
          name?: string
          organization_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          invited_at: string | null
          organization_id: string
          role: Database["public"]["Enums"]["org_member_role"]
          status: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["org_member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["org_member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          city: string | null
          contact_email: string | null
          country: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          phone: string | null
          plan: Database["public"]["Enums"]["org_plan"]
          short_name: string | null
          social_links: Json | null
          status: Database["public"]["Enums"]["org_status"]
          timezone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["org_plan"]
          short_name?: string | null
          social_links?: Json | null
          status?: Database["public"]["Enums"]["org_status"]
          timezone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          plan?: Database["public"]["Enums"]["org_plan"]
          short_name?: string | null
          social_links?: Json | null
          status?: Database["public"]["Enums"]["org_status"]
          timezone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_statistics: {
        Row: {
          assists: number
          average_rating: number | null
          clean_sheets: number
          goals: number
          id: string
          matches_played: number
          minutes_played: number
          player_id: string
          red_cards: number
          tournament_id: string
          updated_at: string
          yellow_cards: number
        }
        Insert: {
          assists?: number
          average_rating?: number | null
          clean_sheets?: number
          goals?: number
          id?: string
          matches_played?: number
          minutes_played?: number
          player_id: string
          red_cards?: number
          tournament_id: string
          updated_at?: string
          yellow_cards?: number
        }
        Update: {
          assists?: number
          average_rating?: number | null
          clean_sheets?: number
          goals?: number
          id?: string
          matches_played?: number
          minutes_played?: number
          player_id?: string
          red_cards?: number
          tournament_id?: string
          updated_at?: string
          yellow_cards?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_statistics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_statistics_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          address: string | null
          age_category: Database["public"]["Enums"]["age_category"] | null
          created_at: string
          date_of_birth: string | null
          document_health_cert_url: string | null
          document_ktp_url: string | null
          document_statement_url: string | null
          email: string | null
          emergency_contact: Json | null
          id: string
          jersey_number: number | null
          name: string
          nationality: string | null
          organization_id: string
          phone: string | null
          photo_url: string | null
          primary_position:
            | Database["public"]["Enums"]["player_position"]
            | null
          secondary_position:
            | Database["public"]["Enums"]["player_position"]
            | null
          status: Database["public"]["Enums"]["player_status"]
          team_id: string | null
          updated_at: string
          verification_notes: string | null
          verification_status:
            | Database["public"]["Enums"]["registration_status"]
            | null
        }
        Insert: {
          address?: string | null
          age_category?: Database["public"]["Enums"]["age_category"] | null
          created_at?: string
          date_of_birth?: string | null
          document_health_cert_url?: string | null
          document_ktp_url?: string | null
          document_statement_url?: string | null
          email?: string | null
          emergency_contact?: Json | null
          id?: string
          jersey_number?: number | null
          name: string
          nationality?: string | null
          organization_id: string
          phone?: string | null
          photo_url?: string | null
          primary_position?:
            | Database["public"]["Enums"]["player_position"]
            | null
          secondary_position?:
            | Database["public"]["Enums"]["player_position"]
            | null
          status?: Database["public"]["Enums"]["player_status"]
          team_id?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?:
            | Database["public"]["Enums"]["registration_status"]
            | null
        }
        Update: {
          address?: string | null
          age_category?: Database["public"]["Enums"]["age_category"] | null
          created_at?: string
          date_of_birth?: string | null
          document_health_cert_url?: string | null
          document_ktp_url?: string | null
          document_statement_url?: string | null
          email?: string | null
          emergency_contact?: Json | null
          id?: string
          jersey_number?: number | null
          name?: string
          nationality?: string | null
          organization_id?: string
          phone?: string | null
          photo_url?: string | null
          primary_position?:
            | Database["public"]["Enums"]["player_position"]
            | null
          secondary_position?:
            | Database["public"]["Enums"]["player_position"]
            | null
          status?: Database["public"]["Enums"]["player_status"]
          team_id?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?:
            | Database["public"]["Enums"]["registration_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "players_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referees: {
        Row: {
          badge_level: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          photo_url: string | null
          rating: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          badge_level?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          badge_level?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          file_path: string | null
          generated_by: string | null
          id: string
          organization_id: string
          parameters: Json | null
          status: Database["public"]["Enums"]["report_status"]
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_path?: string | null
          generated_by?: string | null
          id?: string
          organization_id: string
          parameters?: Json | null
          status?: Database["public"]["Enums"]["report_status"]
          title: string
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_path?: string | null
          generated_by?: string | null
          id?: string
          organization_id?: string
          parameters?: Json | null
          status?: Database["public"]["Enums"]["report_status"]
          title?: string
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      standings: {
        Row: {
          draws: number
          goals_against: number
          goals_for: number
          id: string
          losses: number
          played: number
          points: number
          position: number
          team_id: string
          tournament_id: string
          updated_at: string
          wins: number
        }
        Insert: {
          draws?: number
          goals_against?: number
          goals_for?: number
          id?: string
          losses?: number
          played?: number
          points?: number
          position?: number
          team_id: string
          tournament_id: string
          updated_at?: string
          wins?: number
        }
        Update: {
          draws?: number
          goals_against?: number
          goals_for?: number
          id?: string
          losses?: number
          played?: number
          points?: number
          position?: number
          team_id?: string
          tournament_id?: string
          updated_at?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          city: string | null
          coach_name: string | null
          created_at: string
          description: string | null
          founding_date: string | null
          id: string
          logo_url: string | null
          manager_name: string | null
          name: string
          organization_id: string
          status: Database["public"]["Enums"]["team_status"]
          updated_at: string
        }
        Insert: {
          city?: string | null
          coach_name?: string | null
          created_at?: string
          description?: string | null
          founding_date?: string | null
          id?: string
          logo_url?: string | null
          manager_name?: string | null
          name: string
          organization_id: string
          status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Update: {
          city?: string | null
          coach_name?: string | null
          created_at?: string
          description?: string | null
          founding_date?: string | null
          id?: string
          logo_url?: string | null
          manager_name?: string | null
          name?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["team_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_teams: {
        Row: {
          id: string
          registered_at: string
          status: Database["public"]["Enums"]["registration_status"] | null
          team_id: string
          tournament_id: string
          verification_notes: string | null
        }
        Insert: {
          id?: string
          registered_at?: string
          status?: Database["public"]["Enums"]["registration_status"] | null
          team_id: string
          tournament_id: string
          verification_notes?: string | null
        }
        Update: {
          id?: string
          registered_at?: string
          status?: Database["public"]["Enums"]["registration_status"] | null
          team_id?: string
          tournament_id?: string
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          age_category: Database["public"]["Enums"]["age_category"]
          created_at: string
          description: string | null
          end_date: string | null
          format: Database["public"]["Enums"]["tournament_format"]
          id: string
          location: string | null
          logo_url: string | null
          max_teams: number | null
          name: string
          organization_id: string
          registration_deadline: string | null
          registration_fee: number | null
          rules: string | null
          sport_type: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["tournament_status"]
          updated_at: string
        }
        Insert: {
          age_category?: Database["public"]["Enums"]["age_category"]
          created_at?: string
          description?: string | null
          end_date?: string | null
          format?: Database["public"]["Enums"]["tournament_format"]
          id?: string
          location?: string | null
          logo_url?: string | null
          max_teams?: number | null
          name: string
          organization_id: string
          registration_deadline?: string | null
          registration_fee?: number | null
          rules?: string | null
          sport_type?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
        }
        Update: {
          age_category?: Database["public"]["Enums"]["age_category"]
          created_at?: string
          description?: string | null
          end_date?: string | null
          format?: Database["public"]["Enums"]["tournament_format"]
          id?: string
          location?: string | null
          logo_url?: string | null
          max_teams?: number | null
          name?: string
          organization_id?: string
          registration_deadline?: string | null
          registration_fee?: number | null
          rules?: string | null
          sport_type?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venue_bookings: {
        Row: {
          created_at: string
          end_time: string
          id: string
          notes: string | null
          requester_name: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          venue_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          requester_name?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          venue_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          requester_name?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          amenities: Json | null
          capacity: number | null
          city: string | null
          contact: Json | null
          country: string | null
          created_at: string
          description: string | null
          facilities: string[] | null
          id: string
          images: Json | null
          lat: number | null
          length_m: number | null
          lng: number | null
          name: string
          organization_id: string
          pricing: Json | null
          timezone: string | null
          type: Database["public"]["Enums"]["venue_type"]
          updated_at: string
          width_m: number | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          capacity?: number | null
          city?: string | null
          contact?: Json | null
          country?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          id?: string
          images?: Json | null
          lat?: number | null
          length_m?: number | null
          lng?: number | null
          name: string
          organization_id: string
          pricing?: Json | null
          timezone?: string | null
          type?: Database["public"]["Enums"]["venue_type"]
          updated_at?: string
          width_m?: number | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          capacity?: number | null
          city?: string | null
          contact?: Json | null
          country?: string | null
          created_at?: string
          description?: string | null
          facilities?: string[] | null
          id?: string
          images?: Json | null
          lat?: number | null
          length_m?: number | null
          lng?: number | null
          name?: string
          organization_id?: string
          pricing?: Json | null
          timezone?: string | null
          type?: Database["public"]["Enums"]["venue_type"]
          updated_at?: string
          width_m?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_org_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["org_member_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      age_category:
        | "senior"
        | "u21"
        | "u19"
        | "u17"
        | "u15"
        | "u13"
        | "u12"
        | "u11"
        | "u10"
        | "u9"
        | "u8"
      app_role:
        | "super_admin"
        | "organizer"
        | "club_manager"
        | "referee"
        | "player"
        | "viewer"
      booking_status: "available" | "pending" | "booked"
      match_event_type:
        | "goal"
        | "yellow_card"
        | "red_card"
        | "substitution"
        | "var_review"
      match_status: "upcoming" | "live" | "completed" | "delayed"
      member_status: "active" | "invited" | "suspended"
      org_member_role:
        | "admin"
        | "manager"
        | "coordinator"
        | "referee_manager"
        | "analyst"
      org_plan: "starter" | "pro" | "enterprise"
      org_status: "active" | "inactive"
      player_position:
        | "goalkeeper"
        | "defender"
        | "midfielder"
        | "forward"
        | "multi_position"
      player_status: "active" | "inactive" | "suspended"
      referee_role:
        | "referee"
        | "assistant_1"
        | "assistant_2"
        | "fourth_official"
        | "var"
      report_status: "pending" | "generating" | "completed" | "failed"
      report_type:
        | "tournament_summary"
        | "player_performance"
        | "match_report"
        | "financial"
        | "attendance"
        | "discipline"
      team_status: "active" | "inactive" | "pending"
      tournament_format:
        | "league"
        | "knockout"
        | "group_knockout"
        | "round_robin"
      tournament_status: "draft" | "upcoming" | "active" | "completed"
      venue_type:
        | "stadium"
        | "arena"
        | "training_ground"
        | "indoor"
        | "community_field"
      notification_type: "info" | "success" | "warning" | "error"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      registration_status: "pending" | "verified" | "rejected" | "paid"
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
      age_category: [
        "senior",
        "u21",
        "u19",
        "u17",
        "u15",
        "u13",
        "u12",
        "u11",
        "u10",
        "u9",
        "u8",
      ],
      app_role: [
        "super_admin",
        "organizer",
        "club_manager",
        "referee",
        "player",
        "viewer",
      ],
      booking_status: ["available", "pending", "booked"],
      match_event_type: [
        "goal",
        "yellow_card",
        "red_card",
        "substitution",
        "var_review",
      ],
      match_status: ["upcoming", "live", "completed", "delayed"],
      member_status: ["active", "invited", "suspended"],
      org_member_role: [
        "admin",
        "manager",
        "coordinator",
        "referee_manager",
        "analyst",
      ],
      org_plan: ["starter", "pro", "enterprise"],
      org_status: ["active", "inactive"],
      player_position: [
        "goalkeeper",
        "defender",
        "midfielder",
        "forward",
        "multi_position",
      ],
      player_status: ["active", "inactive", "suspended"],
      referee_role: [
        "referee",
        "assistant_1",
        "assistant_2",
        "fourth_official",
        "var",
      ],
      report_status: ["pending", "generating", "completed", "failed"],
      report_type: [
        "tournament_summary",
        "player_performance",
        "match_report",
        "financial",
        "attendance",
        "discipline",
      ],
      team_status: ["active", "inactive", "pending"],
      tournament_format: [
        "league",
        "knockout",
        "group_knockout",
        "round_robin",
      ],
      tournament_status: ["draft", "upcoming", "active", "completed"],
      venue_type: [
        "stadium",
        "arena",
        "training_ground",
        "indoor",
        "community_field",
      ],
      notification_type: ["info", "success", "warning", "error"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      registration_status: ["pending", "verified", "rejected", "paid"],
    },
  },
} as const
