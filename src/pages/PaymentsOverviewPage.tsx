import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentsTable } from "@/components/Payment/PaymentsTable";
import { PaymentsFilters } from "@/components/Payment/PaymentsFilters";
import { usePayments, useSendPaymentLink } from "@/hooks/usePayments";
import { RefreshCw } from "lucide-react";

export default function PaymentsOverviewPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filters = {
    status: status !== 'all' ? status : undefined,
    search: search || undefined,
    dateFrom: dateFrom?.toISOString().split('T')[0],
    dateTo: dateTo?.toISOString().split('T')[0],
  };

  const { payments, loading, error, refresh } = usePayments(filters);
  const { sendLink, sending } = useSendPaymentLink();

  const handleSendLink = (paymentId: string) => {
    sendLink(paymentId);
  };

  const handleRefresh = () => {
    refresh();
  };

  const hasActiveFilters = search !== '' || status !== 'all' || !!dateFrom || !!dateTo;

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">Payments</h1>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Filters skeleton */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[160px]" />
                  <Skeleton className="h-10 w-[140px]" />
                  <Skeleton className="h-10 w-[140px]" />
                </div>
              </div>
            </div>

            {/* Table skeleton */}
            <Card>
              <CardContent className="p-0">
                <div className="space-y-4 p-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-6 w-[60px]" />
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-8 w-[80px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">Payments</h1>
          </div>
          
          <div className="flex items-center justify-center min-h-[400px]">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center mb-4">
                  Can't load payments. Please try again.
                </p>
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  className="w-full"
                  data-testid="retry-button"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">Payments</h1>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            data-testid="payments-refresh"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <PaymentsFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            dateFrom={dateFrom}
            onDateFromChange={setDateFrom}
            dateTo={dateTo}
            onDateToChange={setDateTo}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />

          {payments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg mb-2">
                  {hasActiveFilters ? 'No payments match your filters' : 'No payments to display'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hasActiveFilters ? 'Try adjusting your search criteria' : 'All payments are up to date'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <PaymentsTable
              payments={payments}
              onSendLink={handleSendLink}
              sending={sending}
            />
          )}
        </div>
      </div>
    </main>
  );
}