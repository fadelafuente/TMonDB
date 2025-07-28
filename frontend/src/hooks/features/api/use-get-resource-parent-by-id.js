import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';

export function useGetResourceParentById(resource, id) {
  return useQuery({
    queryKey: [resource, id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/api/${resource}/${id}/parent/`);
        return response.data;
      } catch (error) {
        console.error('Error fetching resource:', error);
        return null;
      }
    }
  })
}