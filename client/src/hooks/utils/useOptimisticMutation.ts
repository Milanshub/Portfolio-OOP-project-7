import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseOptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: readonly unknown[];
  updateFn: (oldData: TData | undefined, newData: TData) => TData;
  rollbackFn?: (oldData: TData | undefined) => void;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface MutationContext<TData> {
  previousData: TData | undefined;
}

export function useOptimisticMutation<TData, TVariables>({
  mutationFn,
  queryKey,
  updateFn,
  rollbackFn,
  onSuccess,
  onError,
  successMessage = 'Operation successful',
  errorMessage = 'Operation failed',
}: UseOptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables, MutationContext<TData>>({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<TData>(queryKey, (old) => {
        if (!old) return old;
        return updateFn(old, variables as unknown as TData);
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, _variables, context) => {
      // Rollback to the previous value if available
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
        if (rollbackFn) {
          rollbackFn(context.previousData);
        }
      }

      // Show error toast
      const errorDescription = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage, {
        description: errorDescription,
      });

      // Call custom error handler
      if (onError) {
        onError(err instanceof Error ? err : new Error('An error occurred'));
      }
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success(successMessage);

      // Call custom success handler
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're up to date
      queryClient.invalidateQueries({ queryKey });
    },
  });
} 