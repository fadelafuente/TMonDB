import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import getApiHeaders from '../../../lib/api-config';

export function useGetResource(resource, kwargs = {}, query) {
  return useInfiniteQuery({
    queryKey: [resource, kwargs],
    queryFn: async ({ pageParam }) => {
      try {
        let queryString = Object.keys(kwargs).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(kwargs[key])).join('&');
        if(query) {
          queryString ? queryString += `&search=${query}` : queryString = `search=${query}`;
        }

        const config = { headers: getApiHeaders() };
        const response = await axiosInstance.get(`/api/${resource}/?page=${pageParam}${queryString ? `&${queryString}` : ''}`, config);
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