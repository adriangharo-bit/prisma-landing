export interface ShopifyCustomer {
  id: number;
  email: string;
  first_name: string | null;
  tags: string;
  note: string | null;
  accepts_marketing?: boolean;
  created_at?: string;
}

export interface WinnerRecord {
  name: string;
  email: string;
  email_masked: string;
  code: string;
  email_sent: boolean;
}

export interface RaffleResult {
  winners: WinnerRecord[];
  run_at: string;
}

export type RegisterErrorCode =
  | "missing_fields"
  | "invalid_email"
  | "invalid_code"
  | "already_registered"
  | "rate_limited"
  | "server_error";
