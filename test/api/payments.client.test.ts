import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { paymentsHandlers } from '@/mocks/handlers/payments';
import { listPayments, sendPaymentLink, listFees, createPaymentIntent } from '@/api/payments';

const server = setupServer(...paymentsHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Payments API Client', () => {
  describe('listPayments', () => {
    it('should fetch payments', async () => {
      const result = await listPayments(1);
      
      expect(result).toEqual(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              clubId: 1,
              member: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
              }),
              title: expect.any(String),
              amountCents: expect.any(Number),
              currency: expect.any(String),
              status: expect.stringMatching(/^(pending|processing|paid|failed)$/),
              createdAt: expect.any(String),
            })
          ]),
        })
      );
      
      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should handle filters', async () => {
      const result = await listPayments(1, undefined, 50, { 
        status: 'pending',
        search: 'Anna'
      });
      
      // Should only return pending payments
      result.items.forEach(payment => {
        expect(payment.status).toBe('pending');
      });
      
      // Should only return payments matching search
      const hasAnna = result.items.some(payment => 
        payment.member.name.includes('Anna')
      );
      expect(hasAnna).toBe(true);
    });
  });

  describe('sendPaymentLink', () => {
    it('should send payment link', async () => {
      // Should not throw
      await expect(sendPaymentLink('payment-1')).resolves.not.toThrow();
    });

    it('should handle non-existent payment', async () => {
      await expect(
        sendPaymentLink('non-existent-payment')
      ).rejects.toThrow('Failed to send payment link');
    });
  });

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