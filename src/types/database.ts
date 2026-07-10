export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      love_chits: {
        Row: {
          id: string;
          title: string;
          description: string;
          emoji: string;
          theme: string;
          illustration: string | null;
          redeemed: boolean;
          redeemed_at: string | null;
          created_at: string;
          order_index: number;
          gif_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          emoji: string;
          theme: string;
          illustration?: string | null;
          redeemed?: boolean;
          redeemed_at?: string | null;
          created_at?: string;
          order_index: number;
          gif_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          emoji?: string;
          theme?: string;
          illustration?: string | null;
          redeemed?: boolean;
          redeemed_at?: string | null;
          created_at?: string;
          order_index?: number;
          gif_url?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
