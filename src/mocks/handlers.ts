import { http, HttpResponse } from 'msw';

// Mock data
const mockProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  notify_email: true,
  notify_push: false,
};

const mockFees = [
  {
    id: 'fee_1',
    club_id: 1,
    title: 'Monthly Club Fee',
    amount_cents: 15000,
    currency: 'DKK',
    due_at: '2024-02-15T00:00:00Z',
    status: 'unpaid',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  },
  {
    id: 'fee_2',
    club_id: 1,
    title: 'Match Fee - vs Eagles',
    amount_cents: 5000,
    currency: 'DKK',
    due_at: '2024-02-10T00:00:00Z',
    status: 'unpaid',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: null,
  },
];

const mockClubSettings = {
  id: 'tigers-fc',
  name: 'Tigers FC',
  logo_url: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=150&h=150&fit=crop',
  primary_color: '#1F4ED8',
  secondary_color: '#0EA5E9',
  rsvp_defaults: {
    deadline_hours: 24,
    visibility: 'members' as const,
    auto_reminders: true,
    reminder_hours: 2,
  },
};

export const handlers = [
  // Profile endpoints
  http.get('/api/profile', () => {
    return HttpResponse.json(mockProfile);
  }),

  http.put('/api/profile', async ({ request }) => {
    const updates = await request.json() as any;
    const updatedProfile = { ...mockProfile, ...updates };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json(updatedProfile);
  }),

  http.post('/api/uploads/avatar', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock URL
    return HttpResponse.json({ 
      url: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&v=${Date.now()}`
    });
  }),

  // Club settings endpoints
  http.get('/api/clubs/:id/settings', ({ params }) => {
    return HttpResponse.json({
      ...mockClubSettings,
      id: params.id,
    });
  }),

  http.put('/api/clubs/:id/settings', async ({ params, request }) => {
    const updates = await request.json() as any;
    const updatedSettings = { 
      ...mockClubSettings, 
      id: params.id,
      ...updates,
      rsvp_defaults: updates.rsvp_defaults 
        ? { ...mockClubSettings.rsvp_defaults, ...updates.rsvp_defaults }
        : mockClubSettings.rsvp_defaults
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json(updatedSettings);
  }),

  http.post('/api/uploads/club-logo', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock URL
    return HttpResponse.json({ 
      url: `https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=150&h=150&fit=crop&v=${Date.now()}`
    });
  }),

  // Payments/Fees endpoints
  http.get('/api/clubs/:clubId/fees', ({ params }) => {
    return HttpResponse.json({
      items: mockFees.filter(fee => fee.club_id === Number(params.clubId)),
      next_cursor: null,
    });
  }),

  http.post('/api/clubs/:clubId/fees/:feeId/intent', async ({ params }) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return HttpResponse.json({
      intent_id: `intent_${params.feeId}_${Date.now()}`,
      provider: 'stripe',
      checkout_url: `https://checkout.stripe.test/session/${params.feeId}`,
    });
  }),

  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication logic
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        token: 'test-token-123',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      });
    }
    
    // Invalid credentials
    return HttpResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }),

  // Sign up endpoint
  http.post('/api/auth/signup', async ({ request }) => {
    const body = await request.json() as { 
      name: string; 
      email: string; 
      password: string; 
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check for existing user (simulate database check)
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        { error: 'Please check your information and try again' },
        { status: 422 }
      );
    }

    // Simulate successful signup
    return HttpResponse.json({
      token: 'signup-token-456',
      user: {
        id: '2',
        email: body.email,
        name: body.name,
      },
    });
  }),
];