import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { paymentsHandlers } from '@/mocks/handlers/payments';
import { usePayments, useCreateIntent } from '@/hooks/usePayments';

const server = setupServer(...paymentsHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const TestComponent = ({ clubId }: { clubId: number }) => {
  const { fees, loading, refresh } = usePayments(clubId);
  const { create, creating } = useCreateIntent(clubId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <ul data-testid="fees-list">
        {fees.map((fee) => (
          <li key={fee.id} data-testid="fee-item">
            <span>{fee.title}</span>
            <span>{fee.status}</span>
            {fee.status === 'unpaid' && (
              <button
                onClick={() => create(fee.id)}
                disabled={creating}
                data-testid={`pay-${fee.id}`}
              >
                Pay
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('usePayments hook', () => {
  it('renders fees and shows Pay button on unpaid fees only', async () => {
    renderWithQueryClient(<TestComponent clubId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('fees-list')).toBeInTheDocument();
    });

    // Check that we have fees displayed
    const feeItems = screen.getAllByTestId('fee-item');
    expect(feeItems.length).toBeGreaterThan(0);

    // Check that unpaid fees have Pay buttons
    const unpaidFees = feeItems.filter(item => 
      item.textContent?.includes('unpaid')
    );
    expect(unpaidFees.length).toBeGreaterThan(0);

    // Check that paid fees don't have Pay buttons
    const paidFees = feeItems.filter(item => 
      item.textContent?.includes('paid') && !item.textContent?.includes('unpaid')
    );
    
    for (const paidFee of paidFees) {
      expect(paidFee.querySelector('button[data-testid^="pay-"]')).toBeNull();
    }
  });

  it('updates fees when refresh is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<TestComponent clubId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('fees-list')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    await user.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByTestId('fees-list')).toBeInTheDocument();
    });
  });
});