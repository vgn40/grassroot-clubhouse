import { http, HttpResponse } from 'msw';
import type { FeePageDTO, PaymentIntentDTO, FeeDTO } from '@/models/payments';

// Mock data
const mockFees: FeeDTO[] = [
  {
    id: 'fee-1',
    club_id: 1,
    title: 'Monthly Membership Fee',
    amount_cents: 15000, // 150 DKK
    currency: 'DKK',
    due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
    status: 'unpaid',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: 'fee-2',
    club_id: 1,
    title: 'Equipment Fund Contribution',
    amount_cents: 25000, // 250 DKK
    currency: 'DKK',
    due_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
    status: 'unpaid',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Created 2 days ago
    updated_at: null,
  },
  {
    id: 'fee-3',
    club_id: 1,
    title: 'Tournament Entry Fee',
    amount_cents: 30000, // 300 DKK
    currency: 'DKK',
    due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Due in 3 days
    status: 'unpaid',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Created 5 days ago
    updated_at: null,
  },
  {
    id: 'fee-4',
    club_id: 1,
    title: 'Annual Membership',
    amount_cents: 120000, // 1200 DKK
    currency: 'DKK',
    due_at: null,
    status: 'processing',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Created 1 day ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Updated 2 hours ago
  },
  {
    id: 'fee-5',
    club_id: 1,
    title: 'Training Camp Fee',
    amount_cents: 75000, // 750 DKK
    currency: 'DKK',
    due_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Was due 7 days ago
    status: 'paid',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Created 14 days ago
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // Paid 6 days ago
  },
];

// In-memory store to track status changes
let feesStore = [...mockFees];

export const paymentsHandlers = [
  // GET /api/clubs/:id/fees - List fees for a club
  http.get('/api/clubs/:clubId/fees', ({ params, request }) => {
    const clubId = Number(params.clubId);
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Number(url.searchParams.get('limit')) || 50;

    // Filter fees for the specific club
    const clubFees = feesStore.filter(fee => fee.club_id === clubId);
    
    // Simple pagination (in real app, this would be more sophisticated)
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = clubFees.findIndex(fee => String(fee.id) === cursor);
      startIndex = cursorIndex > -1 ? cursorIndex + 1 : 0;
    }
    
    const endIndex = Math.min(startIndex + limit, clubFees.length);
    const items = clubFees.slice(startIndex, endIndex);
    const nextCursor = endIndex < clubFees.length ? String(clubFees[endIndex].id) : null;

    const response: FeePageDTO = {
      items,
      next_cursor: nextCursor,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/clubs/:clubId/fees/:feeId/intent - Create payment intent
  http.post('/api/clubs/:clubId/fees/:feeId/intent', async ({ params, request }) => {
    const { clubId, feeId } = params;
    const body = await request.json() as { client_id: string };
    
    // Find the fee and update its status to processing
    const feeIndex = feesStore.findIndex(fee => 
      String(fee.id) === feeId && fee.club_id === Number(clubId)
    );
    
    if (feeIndex === -1) {
      return HttpResponse.json(
        { error: 'Fee not found' },
        { status: 404 }
      );
    }

    // Update fee status to processing
    feesStore[feeIndex] = {
      ...feesStore[feeIndex],
      status: 'processing',
      updated_at: new Date().toISOString(),
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const response: PaymentIntentDTO = {
      intent_id: `intent_${feeId}_${body.client_id}`,
      provider: 'stripe',
      checkout_url: `https://checkout.stripe.test/intent/${feeId}`,
    };

    return HttpResponse.json(response);
  }),
];