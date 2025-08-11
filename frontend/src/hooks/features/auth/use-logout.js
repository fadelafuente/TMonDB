import { AxiosError } from 'axios';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import getApiHeaders from '../../../lib/api-config';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const config = { headers: getApiHeaders() };
      const response = await axiosInstance.post(`/auth/users/logout/`, {}, config);
      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem('access');
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate('/');
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        console.error('Error logging out: ', error.response?.data || 'Failed to log user out.');
        return error.response?.data;
      }
    }
  });
}