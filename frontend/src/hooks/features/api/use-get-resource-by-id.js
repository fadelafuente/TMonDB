import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';

export function useGetResourceById(resource, id) {
  return useQuery({
    queryKey: [resource, id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/api/${resource}/${id}/`);
        return response.data;
      } catch (error) {
        console.error('Error fetching resource:', error);
        return null;
      }
    }
  })
}