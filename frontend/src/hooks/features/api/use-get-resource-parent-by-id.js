import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import getApiHeaders from '../../../lib/api-config';

export function useGetResourceParentById(resource, id) {
  return useQuery({
    queryKey: [resource, id, 'parent'],
    queryFn: async () => {
      try {
        const config = { headers: getApiHeaders() };
        const response = await axiosInstance.get(`/api/${resource}/${id}/parent/`, config);
        return response.data;
      } catch (error) {
        console.error('Error fetching resource:', error);
        return null;
      }
    }
  })
}