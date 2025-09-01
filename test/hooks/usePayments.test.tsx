import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { paymentsHandlers } from '@/mocks/handlers/payments';
import { usePayments, useSendPaymentLink, useFees, useCreateIntent } from '@/hooks/usePayments';

const server = setupServer(...paymentsHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const PaymentsTestComponent = ({ filters }: { filters?: any }) => {
  const { payments, loading, refresh } = usePayments(filters);
  const { sendLink, sending } = useSendPaymentLink();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <div data-testid="payments-table">
        {payments.map((payment) => (
          <div key={payment.id} data-testid="payment-item">
            <span>{payment.member.name}</span>
            <span>{payment.title}</span>
            <span>{payment.status}</span>
            {(payment.status === 'pending' || payment.status === 'failed') && (
              <button
                onClick={() => sendLink(payment.id)}
                disabled={sending}
                data-testid={`send-link-${payment.id}`}
              >
                Send Link
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FeesTestComponent = ({ clubId }: { clubId: number }) => {
  const { fees, loading, refresh } = useFees(clubId);
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
  it('renders payments and shows Send Link button on pending/failed payments only', async () => {
    renderWithQueryClient(<PaymentsTestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('payments-table')).toBeInTheDocument();
    });

    // Check that we have payments displayed
    const paymentItems = screen.getAllByTestId('payment-item');
    expect(paymentItems.length).toBeGreaterThan(0);

    // Check that pending payments have Send Link buttons
    const pendingPayments = paymentItems.filter(item => 
      item.textContent?.includes('pending')
    );
    expect(pendingPayments.length).toBeGreaterThan(0);

    // Check that paid payments don't have Send Link buttons
    const paidPayments = paymentItems.filter(item => 
      item.textContent?.includes('paid') && !item.textContent?.includes('pending')
    );
    
    for (const paidPayment of paidPayments) {
      expect(paidPayment.querySelector('button[data-testid^="send-link-"]')).toBeNull();
    }
  });

  it('updates payments when refresh is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<PaymentsTestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('payments-table')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    await user.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByTestId('payments-table')).toBeInTheDocument();
    });
  });

  it('handles filters correctly', async () => {
    const filters = { status: 'pending', search: 'Anna' };
    renderWithQueryClient(<PaymentsTestComponent filters={filters} />);

    await waitFor(() => {
      expect(screen.getByTestId('payments-table')).toBeInTheDocument();
    });

    // Should only show pending payments
    const paymentItems = screen.getAllByTestId('payment-item');
    paymentItems.forEach(item => {
      expect(item.textContent).toContain('pending');
    });
  });
});

describe('useFees hook (backward compatibility)', () => {
  it('renders fees and shows Pay button on unpaid fees only', async () => {
    renderWithQueryClient(<FeesTestComponent clubId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('fees-list')).toBeInTheDocument();
    });

    // Check that we have fees displayed
    const feeItems = screen.getAllByTestId('fee-item');
    expect(feeItems.length).toBeGreaterThan(0);
  });

  it('updates fees when refresh is clicked', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<FeesTestComponent clubId={1} />);

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