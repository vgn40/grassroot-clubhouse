import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useCreateIntent } from '@/hooks/usePayments';
import type { Fee } from '@/models/payments';

interface PayButtonProps {
  fee: Fee;
  clubId: number;
  className?: string;
}

export function PayButton({ fee, clubId, className }: PayButtonProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const { create, creating } = useCreateIntent(clubId);

  // Check if we're in backend mode (no MSW)
  const isBackendMode = !window.location.host.includes('lovable') || 
    import.meta.env.VITE_E2E_BACKEND === 'true';

  const handlePay = async () => {
    if (fee.status !== 'unpaid') return;

    // In MSW mode, open popup immediately then navigate it
    let popup: Window | null = null;
    
    try {
      if (!isBackendMode) {
        popup = window.open('about:blank', '_blank', 'width=600,height=800');
        if (!popup) {
          // Popup blocked, show fallback
          setShowFallback(true);
          return;
        }
      }

      // Create payment intent using the mutation
      create(fee.id);

      // Note: The actual navigation will be handled by the mutation's onSuccess callback
      // If in backend mode or popup is blocked, we'll show the fallback dialog
      if (isBackendMode) {
        // In backend mode, we'll show the fallback dialog with a mock URL
        setCheckoutUrl(`https://checkout.stripe.test/intent/${fee.id}`);
        setShowFallback(true);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      if (popup && !isBackendMode) {
        popup.close();
      }
    }
  };

  const formatAmount = (amountCents: number, currency: string) => {
    const amount = amountCents / 100;
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const isPending = creating || fee.status === 'processing';
  const isDisabled = fee.status !== 'unpaid' || isPending;

  const getButtonText = () => {
    if (creating) return 'Processing...';
    if (fee.status === 'processing') return 'Processing';
    if (fee.status === 'paid') return 'Paid';
    if (fee.status === 'failed') return 'Retry';
    return 'Pay';
  };

  return (
    <>
      <Button
        onClick={handlePay}
        disabled={isDisabled}
        size="sm"
        className={className}
        data-testid="fee-pay-btn"
      >
        {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {getButtonText()}
      </Button>

      <Dialog open={showFallback} onOpenChange={setShowFallback}>
        <DialogContent data-testid="payment-fallback">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Click the link below to complete your payment for {fee.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium">{fee.title}</div>
              <div className="text-lg font-bold text-primary">
                {formatAmount(fee.amountCents, fee.currency)}
              </div>
            </div>
            
            <Button
              asChild
              className="w-full"
              size="lg"
            >
              <a 
                href={checkoutUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Continue to Payment
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}