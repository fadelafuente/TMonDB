import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import getApiHeaders from '../../../lib/api-config';

export function useGetResourceById(resource, id) {
  return useQuery({
    queryKey: [resource, id],
    queryFn: async () => {
      try {
        const config = { headers: getApiHeaders() };
        const response = await axiosInstance.get(`/api/${resource}/${id}/`, config);
        return response.data;
      } catch (error) {
        console.error('Error fetching resource:', error);
        return null;
      }
    }
  })
}