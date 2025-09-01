import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { listPayments, sendPaymentLink, listFees, createPaymentIntent } from '@/api/payments';
import type { Payment, PaymentPage, Fee, FeePage } from '@/models/payments';

interface PaymentFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const usePayments = (filters?: PaymentFilters) => {
  const query = useQuery({
    queryKey: ['payments', filters],
    queryFn: () => listPayments(1, undefined, 50, filters), // Mock club ID for now
    staleTime: 30000, // 30 seconds
  });

  const loadMore = async () => {
    // TODO: Implement pagination when needed
  };

  const refresh = () => {
    query.refetch();
  };

  return {
    payments: query.data?.items ?? [],
    nextCursor: query.data?.nextCursor ?? null,
    loading: query.isLoading,
    error: query.error,
    loadMore,
    refresh,
  };
};

export const useSendPaymentLink = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: sendPaymentLink,
    onMutate: async (paymentId) => {
      // Optimistically update payment status
      await queryClient.cancelQueries({ queryKey: ['payments'] });
      
      const queries = queryClient.getQueriesData<PaymentPage>({ queryKey: ['payments'] });
      const previousData: Array<{ queryKey: any; data: PaymentPage | undefined }> = [];
      
      queries.forEach(([queryKey, data]) => {
        previousData.push({ queryKey, data });
        
        if (data) {
          const updatedItems = data.items.map(payment =>
            payment.id === paymentId 
              ? { ...payment, status: 'processing' as const }
              : payment
          );
          
          queryClient.setQueryData(queryKey, {
            ...data,
            items: updatedItems,
          });
        }
      });
      
      return { previousData };
    },
    onSuccess: () => {
      toast({
        title: "Payment link sent",
        description: "The payment link has been sent successfully.",
      });
    },
    onError: (error, paymentId, context) => {
      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      toast({
        title: "Failed to send link",
        description: "Unable to send payment link. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Refetch to get latest status
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  return {
    sendLink: mutation.mutate,
    sending: mutation.isPending,
  };
};

export const useFees = (clubId: number | undefined) => {
  const query = useQuery({
    queryKey: ['fees', clubId],
    queryFn: () => listFees(clubId!),
    enabled: !!clubId,
  });

  const loadMore = async () => {
    // TODO: Implement pagination when needed
  };

  const refresh = () => {
    query.refetch();
  };

  return {
    fees: query.data?.items ?? [],
    nextCursor: query.data?.nextCursor ?? null,
    loading: query.isLoading,
    error: query.error,
    loadMore,
    refresh,
  };
};

export const useCreateIntent = (clubId: number | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (feeId: string) => {
      if (!clubId) throw new Error('Club ID is required');
      
      const clientId = crypto.randomUUID ? crypto.randomUUID() : 
        'fallback-' + Math.random().toString(36).substring(2, 15);
      
      return createPaymentIntent(clubId, feeId, clientId);
    },
    onMutate: async (feeId) => {
      // Optimistically update fee status to processing
      await queryClient.cancelQueries({ queryKey: ['fees', clubId] });
      
      const previousData = queryClient.getQueryData<FeePage>(['fees', clubId]);
      
      if (previousData) {
        const updatedItems = previousData.items.map(fee =>
          fee.id === feeId ? { ...fee, status: 'processing' as const } : fee
        );
        
        queryClient.setQueryData(['fees', clubId], {
          ...previousData,
          items: updatedItems,
        });
      }
      
      return { previousData };
    },
    onSuccess: (data) => {
      toast({
        title: "Payment initiated",
        description: "Redirecting to payment provider...",
      });
    },
    onError: (error, feeId, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['fees', clubId], context.previousData);
      }
      
      toast({
        title: "Payment failed",
        description: "Unable to start payment. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Refetch to get latest status
      queryClient.invalidateQueries({ queryKey: ['fees', clubId] });
    },
  });

  return {
    create: mutation.mutate,
    creating: mutation.isPending,
  };
};
