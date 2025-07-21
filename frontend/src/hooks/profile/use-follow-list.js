import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios-config';

export function useFollowList(username, follow_type, query) {
  return useInfiniteQuery({
    queryKey: [follow_type, username],
    queryFn: async ({ pageParam }) => {
      try {
        const queryString = query ? `&search=${query}` : '';

        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/auth/users/${username}/${follow_type}/?page=${pageParam}${queryString ? `&${queryString}` : ''}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching resource:', error);
        return null;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.next) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('page')) || null;
      }
      return null;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage && firstPage.previous) {
        const url = new URL(firstPage.previous);
        return Number(url.searchParams.get('page')) || null;
      }
      return null;
    },
  });
}