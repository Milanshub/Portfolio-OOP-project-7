import { useInfiniteQuery as useReactQuery, InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface PageParam {
  page: number;
  limit: number;
}

interface PageResponse<T> {
  data: T[];
  nextPage: number | null;
  totalPages: number;
  totalItems: number;
}

interface UseInfiniteQueryOptions<T> {
  queryKey: readonly unknown[];
  queryFn: (pageParam: PageParam) => Promise<PageResponse<T>>;
  limit?: number;
  enabled?: boolean;
}

type InfiniteQueryData<T> = InfiniteData<PageResponse<T>>;

interface CustomInfiniteQueryResult<T> {
  items: T[];
  totalItems: number;
  ref: (node?: Element | null) => void;
  isLoadingMore: boolean;
  data?: InfiniteQueryData<T>;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  isFetchingNextPage: boolean;
  status: 'pending' | 'error' | 'success';
  refetch: () => Promise<void>;
}

export function useInfiniteQuery<T>({
  queryKey,
  queryFn,
  limit = 10,
  enabled = true,
}: UseInfiniteQueryOptions<T>): CustomInfiniteQueryResult<T> {
  const { ref, inView } = useInView();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    error,
    status,
    refetch,
  } = useReactQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn({ 
      page: typeof pageParam === 'number' ? pageParam : 1, 
      limit 
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages[0]?.totalItems ?? 0;

  return {
    items,
    totalItems,
    ref,
    isLoadingMore: isFetchingNextPage,
    data,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage: async () => {
      await fetchNextPage();
    },
    isFetchingNextPage,
    status,
    refetch: async () => {
      await refetch();
    },
  };
} 