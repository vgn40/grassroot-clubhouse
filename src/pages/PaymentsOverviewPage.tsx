import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PayButton } from "@/components/Payment/PayButton";
import { useFees } from "@/hooks/usePayments";
import { AppLayout } from "@/components/Layout/AppLayout";
import { RefreshCw, Calendar } from "lucide-react";

export default function PaymentsOverviewPage() {
  // Mock club ID - in real app this would come from context/params
  const clubId = 1;
  const { fees, loading, error, refresh } = useFees(clubId);

  const handleRefresh = () => {
    refresh();
  };

  if (loading) {
    return (
      <AppLayout>
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">Pay your club and match fees</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-9 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">Pay your club and match fees</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center mb-4">
                    Can't load fees. Please try again.
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
      </AppLayout>
    );
  }

  const formatAmount = (amountCents: number, currency: string) => {
    const amount = amountCents / 100;
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <AppLayout>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="text-muted-foreground">Pay your club and match fees</p>
            </div>
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

          {fees.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No fees right now</h3>
                <p className="text-muted-foreground">
                  All your fees are up to date
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4" data-testid="fees-list">
              {fees.map((fee) => (
                <Card key={fee.id} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{fee.title}</h3>
                        <p className="text-lg font-bold text-primary">
                          {formatAmount(fee.amountCents, fee.currency)}
                        </p>
                        {fee.dueAt && (
                          <p className="text-sm text-muted-foreground">
                            Due {new Date(fee.dueAt).toLocaleDateString('da-DK')}
                          </p>
                        )}
                      </div>
                      <PayButton fee={fee} clubId={clubId} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}