import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { listFees, createPaymentIntent } from '@/api/payments';
import type { Fee, FeePage } from '@/models/payments';

export const usePayments = (clubId: number | undefined) => {
  const query = useQuery({
    queryKey: ['payments', clubId],
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
      await queryClient.cancelQueries({ queryKey: ['payments', clubId] });
      
      const previousData = queryClient.getQueryData<FeePage>(['payments', clubId]);
      
      if (previousData) {
        const updatedItems = previousData.items.map(fee =>
          fee.id === feeId ? { ...fee, status: 'processing' as const } : fee
        );
        
        queryClient.setQueryData(['payments', clubId], {
          ...previousData,
          items: updatedItems,
        });
      }
      
      return { previousData };
    },
    onSuccess: (data) => {
      // Open checkout URL in new tab
      window.open(data.checkoutUrl, '_blank', 'noopener');
      
      toast({
        title: "Payment initiated",
        description: "Redirecting to payment provider...",
      });
    },
    onError: (error, feeId, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['payments', clubId], context.previousData);
      }
      
      toast({
        title: "Payment failed",
        description: "Unable to start payment. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Refetch to get latest status
      queryClient.invalidateQueries({ queryKey: ['payments', clubId] });
    },
  });

  return {
    create: mutation.mutate,
    creating: mutation.isPending,
  };
};