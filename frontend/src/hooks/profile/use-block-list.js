import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios-config';

export function useBlockList(query) {
  return useInfiniteQuery({
    queryKey: ['block'],
    queryFn: async ({ pageParam }) => {
      try {
        const queryString = query ? `&search=${query}` : '';

        const response = await axiosInstance.get(`/auth/users/blocking/?page=${pageParam}${queryString}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching resource:', error);
        return null;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if(lastPage && lastPage.next) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('page')) || null;
      }
      return null;
    },
    getPreviousPageParam: (firstPage) => {
      if(firstPage && firstPage.previous) {
        const url = new URL(firstPage.previous);
        return Number(url.searchParams.get('page')) || null;
      }
      return null;
    },
  });
}