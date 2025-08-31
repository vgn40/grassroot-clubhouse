import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { paymentsHandlers } from '@/mocks/handlers/payments';
import { listFees, createPaymentIntent } from '@/api/payments';

const server = setupServer(...paymentsHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Payments API Client', () => {
  describe('listFees', () => {
    it('should fetch fees for a club', async () => {
      const result = await listFees(1);
      
      expect(result).toEqual(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              clubId: 1,
              title: expect.any(String),
              amountCents: expect.any(Number),
              currency: expect.any(String),
              status: expect.stringMatching(/^(unpaid|processing|paid|failed)$/),
              createdAt: expect.any(String),
            })
          ]),
        })
      );
      
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should handle pagination parameters', async () => {
      const result = await listFees(1, undefined, 2);
      
      expect(result.items.length).toBeLessThanOrEqual(2);
    });
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent', async () => {
      const clientId = 'test-client-123';
      const result = await createPaymentIntent(1, 'fee-1', clientId);
      
      expect(result).toEqual({
        intentId: expect.stringContaining('fee-1'),
        provider: 'stripe',
        checkoutUrl: expect.stringContaining('checkout.stripe.test'),
      });
    });

    it('should handle non-existent fee', async () => {
      await expect(
        createPaymentIntent(1, 'non-existent-fee', 'test-client')
      ).rejects.toThrow('Failed to create payment intent');
    });
  });
});