import { postIdem } from '@/lib/network/postIdem';
import type { 
  Fee, 
  FeePage, 
  PaymentIntent, 
  FeeDTO, 
  FeePageDTO, 
  PaymentIntentDTO 
} from '@/models/payments';

// Map DTO to domain types
const mapFeeFromDTO = (dto: FeeDTO): Fee => ({
  id: String(dto.id),
  clubId: dto.club_id,
  title: dto.title,
  amountCents: dto.amount_cents,
  currency: dto.currency,
  dueAt: dto.due_at ?? null,
  status: dto.status,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at ?? null,
});

const mapPaymentIntentFromDTO = (dto: PaymentIntentDTO): PaymentIntent => ({
  intentId: dto.intent_id,
  provider: dto.provider,
  checkoutUrl: dto.checkout_url,
});

export const listFees = async (
  clubId: number,
  cursor?: string,
  limit: number = 50
): Promise<FeePage> => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  params.append('limit', String(limit));
  
  const response = await fetch(`/api/clubs/${clubId}/fees?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch fees');
  }
  
  const data: FeePageDTO = await response.json();
  
  return {
    items: data.items.map(mapFeeFromDTO),
    nextCursor: data.next_cursor ?? null,
  };
};

export const createPaymentIntent = async (
  clubId: number,
  feeId: string,
  clientId: string
): Promise<PaymentIntent> => {
  const resourceKey = `pay:${clubId}:${feeId}:${clientId}`;
  
  const response = await postIdem(
    `/clubs/${clubId}/fees/${feeId}/intent`,
    { client_id: clientId },
    resourceKey
  );
  
  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }
  
  const data: PaymentIntentDTO = await response.json();
  return mapPaymentIntentFromDTO(data);
};