import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeeCard } from "@/components/Payment/FeeCard";
import { usePayments, useCreateIntent } from "@/hooks/usePayments";
import { RefreshCw } from "lucide-react";

export default function PaymentsOverviewPage() {
  // Mock club ID for now - in real app this would come from context/route
  const clubId = 1;
  
  const { fees, loading, error, refresh } = usePayments(clubId);
  const { create: createIntent, creating } = useCreateIntent(clubId);

  const handlePay = (feeId: string) => {
    createIntent(feeId);
  };

  const handleRefresh = () => {
    refresh();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">
                  Can't load payments. Please try again.
                </p>
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  className="mt-4 w-full"
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
            data-testid="fees-refresh"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {fees.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg mb-2">
                No fees to display
              </p>
              <p className="text-sm text-muted-foreground">
                All payments are up to date
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul 
            role="list" 
            data-testid="fees-list"
            className="grid gap-3" 
            style={{ gridAutoRows: 'min-content' }}
          >
            {fees.map((fee) => (
              <FeeCard
                key={fee.id}
                fee={fee}
                onPay={handlePay}
                paying={creating}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}