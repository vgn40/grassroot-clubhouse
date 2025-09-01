export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'processing';

export type Member = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Payment = {
  id: string;
  clubId: number;
  member: Member;
  title: string;
  amountCents: number;
  currency: 'DKK' | 'EUR' | 'USD';
  dueAt: string | null;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string | null;
};

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

export type FeeStatus = 'unpaid' | 'processing' | 'paid' | 'failed';

export type PaymentPage = { 
  items: Payment[]; 
  nextCursor?: string | null; 
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
export type MemberDTO = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type PaymentDTO = {
  id: string | number;
  club_id: number;
  member: MemberDTO;
  title: string;
  amount_cents: number;
  currency: 'DKK' | 'EUR' | 'USD';
  due_at?: string | null;
  status: PaymentStatus;
  created_at: string;
  updated_at?: string | null;
};

export type PaymentPageDTO = { 
  items: PaymentDTO[]; 
  next_cursor?: string | null; 
};

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