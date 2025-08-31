import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Fee } from "@/models/payments";

interface FeeCardProps {
  fee: Fee;
  onPay?: (feeId: string) => void;
  paying?: boolean;
}

const formatAmount = (amountCents: number, currency: string): string => {
  const amount = amountCents / 100;
  
  if (currency === 'DKK') {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK'
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

const formatDueDate = (dueAt: string | null): string | null => {
  if (!dueAt) return null;
  
  return new Date(dueAt).toLocaleDateString([], {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const getStatusVariant = (status: Fee['status']) => {
  switch (status) {
    case 'unpaid':
      return 'destructive';
    case 'processing':
      return 'secondary';
    case 'paid':
      return 'default';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusColor = (status: Fee['status']): string => {
  switch (status) {
    case 'unpaid':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'processing':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'paid':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

export function FeeCard({ fee, onPay, paying = false }: FeeCardProps) {
  const formattedAmount = formatAmount(fee.amountCents, fee.currency);
  const formattedDueDate = formatDueDate(fee.dueAt);
  const canPay = fee.status === 'unpaid' && onPay;

  return (
    <li role="listitem" data-testid="fee-item">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{fee.title}</h3>
              <p className="text-2xl font-bold text-foreground mb-2">
                {formattedAmount}
              </p>
              {formattedDueDate && (
                <p className="text-sm text-muted-foreground">
                  Due: {formattedDueDate}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant="outline"
                className={getStatusColor(fee.status)}
              >
                {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
        {canPay && (
          <CardFooter className="pt-0 pb-6 px-6">
            <Button
              onClick={() => onPay(fee.id)}
              disabled={paying}
              className="ml-auto"
              data-testid="fee-pay-btn"
              data-fee-id={fee.id}
              aria-label={`Pay ${formattedAmount}`}
            >
              {paying ? 'Processing...' : 'Pay'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </li>
  );
}