import { http, HttpResponse } from 'msw';
import type { PaymentPageDTO, PaymentDTO, MemberDTO, FeePageDTO, FeeDTO, PaymentIntentDTO } from '@/models/payments';

// Mock data - payments with member information
const mockMembers: MemberDTO[] = [
  {
    id: 'member-1',
    name: 'Anna Nielsen',
    email: 'anna@example.com',
    avatar: undefined,
  },
  {
    id: 'member-2', 
    name: 'Lars Pedersen',
    email: 'lars@example.com',
    avatar: undefined,
  },
  {
    id: 'member-3',
    name: 'Sofia Andersen',
    email: 'sofia@example.com', 
    avatar: undefined,
  },
  {
    id: 'member-4',
    name: 'Mikkel Jensen',
    email: 'mikkel@example.com',
    avatar: undefined,
  },
  {
    id: 'member-5',
    name: 'Emma Larsen',
    email: 'emma@example.com',
    avatar: undefined,
  },
];

const mockPayments: PaymentDTO[] = [
  {
    id: 'payment-1',
    club_id: 1,
    member: mockMembers[0],
    title: 'Monthly Membership Fee',
    amount_cents: 15000, // 150 DKK
    currency: 'DKK',
    due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in 7 days
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: 'payment-2',
    club_id: 1,
    member: mockMembers[1],
    title: 'Equipment Fund Contribution',
    amount_cents: 25000, // 250 DKK
    currency: 'DKK',
    due_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Due in 14 days
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Created 2 days ago
    updated_at: null,
  },
  {
    id: 'payment-3',
    club_id: 1,
    member: mockMembers[2],
    title: 'Tournament Entry Fee',
    amount_cents: 30000, // 300 DKK
    currency: 'DKK',
    due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Due in 3 days
    status: 'failed',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Created 5 days ago
    updated_at: null,
  },
  {
    id: 'payment-4',
    club_id: 1,
    member: mockMembers[3],
    title: 'Annual Membership',
    amount_cents: 120000, // 1200 DKK
    currency: 'DKK',
    due_at: null,
    status: 'processing',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Created 1 day ago
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Updated 2 hours ago
  },
  {
    id: 'payment-5',
    club_id: 1,
    member: mockMembers[4],
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
let paymentsStore = [...mockPayments];

// Mock fee data for backward compatibility
const mockFees: FeeDTO[] = [
  {
    id: 'fee-1',
    club_id: 1,
    title: 'Monthly Membership Fee',
    amount_cents: 15000,
    currency: 'DKK',
    due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'unpaid',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  // Add other mock fees as needed
];

let feesStore = [...mockFees];

export const paymentsHandlers = [
  // GET /api/payments - List payments (new endpoint)
  http.get('/api/payments', ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const dateFrom = url.searchParams.get('date_from');
    const dateTo = url.searchParams.get('date_to');

    let filteredPayments = [...paymentsStore];

    // Apply filters
    if (status && status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPayments = filteredPayments.filter(payment => 
        payment.member.name.toLowerCase().includes(searchLower) ||
        payment.member.email.toLowerCase().includes(searchLower)
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredPayments = filteredPayments.filter(payment => 
        payment.due_at && new Date(payment.due_at) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredPayments = filteredPayments.filter(payment => 
        payment.due_at && new Date(payment.due_at) <= toDate
      );
    }
    
    // Simple pagination
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = filteredPayments.findIndex(payment => String(payment.id) === cursor);
      startIndex = cursorIndex > -1 ? cursorIndex + 1 : 0;
    }
    
    const endIndex = Math.min(startIndex + limit, filteredPayments.length);
    const items = filteredPayments.slice(startIndex, endIndex);
    const nextCursor = endIndex < filteredPayments.length ? String(filteredPayments[endIndex].id) : null;

    const response: PaymentPageDTO = {
      items,
      next_cursor: nextCursor,
    };

    return HttpResponse.json(response);
  }),

  // POST /api/payments/:id/send - Send payment link
  http.post('/api/payments/:paymentId/send', async ({ params }) => {
    const { paymentId } = params;
    
    // Find the payment and update its status to processing
    const paymentIndex = paymentsStore.findIndex(payment => 
      String(payment.id) === paymentId
    );
    
    if (paymentIndex === -1) {
      return HttpResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status to processing
    paymentsStore[paymentIndex] = {
      ...paymentsStore[paymentIndex],
      status: 'processing',
      updated_at: new Date().toISOString(),
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return HttpResponse.json({ success: true });
  }),
  // GET /api/clubs/:id/fees - List fees for a club (existing endpoint)
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

  // POST /api/clubs/:clubId/fees/:feeId/intent - Create payment intent (existing endpoint)
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