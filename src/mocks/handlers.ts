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
];