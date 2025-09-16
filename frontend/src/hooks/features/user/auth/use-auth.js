import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../lib/axios-config';

export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('access');
        if(!token) {
          return false;
        }
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
          }
        };
        const body = JSON.stringify({ token });

        await axiosInstance.post('/auth/jwt/verify/', body, config);
        return true;
      } catch (error) {
        localStorage.removeItem('access');
        console.error('Error verifying authentication token: ', error);
        return false;
      }
    }
  });
}