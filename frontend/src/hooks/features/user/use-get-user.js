import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import getApiHeaders from '../../../lib/api-config';

export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const config = { headers: getApiHeaders() };
        const response = await axiosInstance.get('/auth/users/me/', config);
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    }
  })
}