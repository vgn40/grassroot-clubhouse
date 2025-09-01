import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send, RotateCcw } from "lucide-react";
import type { Payment } from "@/models/payments";

interface PaymentsTableProps {
  payments: Payment[];
  onSendLink?: (paymentId: string) => void;
  sending?: boolean;
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

const formatDueDate = (dueAt: string | null): string => {
  if (!dueAt) return 'No due date';
  
  return new Date(dueAt).toLocaleDateString([], {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const getStatusColor = (status: Payment['status']): string => {
  switch (status) {
    case 'pending':
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

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function PaymentsTable({ payments, onSendLink, sending = false }: PaymentsTableProps) {
  return (
    <div className="rounded-md border" data-testid="payments-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} data-testid="payment-item">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={payment.member.avatar} alt={payment.member.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(payment.member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{payment.member.name}</div>
                    <div className="text-sm text-muted-foreground">{payment.member.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {formatAmount(payment.amountCents, payment.currency)}
                </div>
                <div className="text-sm text-muted-foreground">{payment.title}</div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={getStatusColor(payment.status)}
                >
                  {payment.status === 'pending' ? 'Pending' :
                   payment.status === 'processing' ? 'Processing' :
                   payment.status === 'paid' ? 'Paid' :
                   payment.status === 'failed' ? 'Failed' : payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {formatDueDate(payment.dueAt)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {(payment.status === 'pending' || payment.status === 'failed') && onSendLink && (
                  <Button
                    onClick={() => onSendLink(payment.id)}
                    disabled={sending}
                    size="sm"
                    variant="outline"
                    data-testid="send-link-btn"
                    data-payment-id={payment.id}
                    aria-label={`${payment.status === 'failed' ? 'Resend' : 'Send'} payment link to ${payment.member.name}`}
                  >
                    {payment.status === 'failed' ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Resend
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </>
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}