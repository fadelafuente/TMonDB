import { useInView } from 'react-intersection-observer'
import { useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query';

export default function useInfiniteScoll({ queryResult }, query, resource) {
  const { ref, inView } = useInView();
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = queryResult;
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries([resource]);
    queryClient.refetchQueries();
  }, [query, resource, queryClient]);

  useEffect(() => {
    if(inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return { data, ref, status, error, isFetching, isFetchingNextPage, isFetchingPreviousPage, fetchNextPage, fetchPreviousPage, hasNextPage, hasPreviousPage };
}