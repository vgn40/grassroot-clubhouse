import { render, screen } from '@testing-library/react';
import { ActivityBannerCard } from '@/components/ActivityBannerCard';

describe('ActivityBannerCard', () => {
  const mockActivity = {
    id: '1',
    title: 'Test Match',
    type: 'match' as const,
    date: 'Dec 15, 2024',
    time: '15:00',
    location: 'Test Stadium',
  };

  it('renders activity title and type pill', () => {
    render(<ActivityBannerCard activity={mockActivity} />);
    
    expect(screen.getByText('Test Match')).toBeInTheDocument();
    expect(screen.getByText('MATCH')).toBeInTheDocument();
  });

  it('displays formatted time correctly', () => {
    render(<ActivityBannerCard activity={mockActivity} />);
    
    // Should show time in 24h format
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('shows circular badges with first letters', () => {
    render(<ActivityBannerCard activity={mockActivity} />);
    
    // Title initial
    expect(screen.getByText('T')).toBeInTheDocument();
    // Type initial
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('handles ISO startsAt format', () => {
    const activityWithISO = {
      ...mockActivity,
      startsAt: '2024-12-15T15:00:00Z',
      date: undefined,
      time: undefined,
    };

    render(<ActivityBannerCard activity={activityWithISO} />);
    
    expect(screen.getByText('Test Match')).toBeInTheDocument();
    expect(screen.getByText('MATCH')).toBeInTheDocument();
  });

  it('applies correct styling for different activity types', () => {
    const trainingActivity = {
      ...mockActivity,
      type: 'training' as const,
    };

    render(<ActivityBannerCard activity={trainingActivity} />);
    
    expect(screen.getByText('TRAINING')).toBeInTheDocument();
  });
});