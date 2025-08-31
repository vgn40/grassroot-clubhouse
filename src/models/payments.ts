export type FeeStatus = 'unpaid' | 'processing' | 'paid' | 'failed';

export type Fee = {
  id: string;
  clubId: number;
  title: string;
  amountCents: number;
  currency: 'DKK' | 'EUR' | 'USD';
  dueAt: string | null;
  status: FeeStatus;
  createdAt: string;
  updatedAt: string | null;
};

export type FeePage = { 
  items: Fee[]; 
  nextCursor?: string | null; 
};

export type PaymentIntent = { 
  intentId: string; 
  provider: 'stripe' | 'mobilepay'; 
  checkoutUrl: string; 
};

// DTO types for API mapping (backend returns snake_case)
export type FeeDTO = {
  id: string | number;
  club_id: number;
  title: string;
  amount_cents: number;
  currency: 'DKK' | 'EUR' | 'USD';
  due_at?: string | null;
  status: FeeStatus;
  created_at: string;
  updated_at?: string | null;
};

export type FeePageDTO = { 
  items: FeeDTO[]; 
  next_cursor?: string | null; 
};

export type PaymentIntentDTO = {
  intent_id: string;
  provider: 'stripe' | 'mobilepay';
  checkout_url: string;
};