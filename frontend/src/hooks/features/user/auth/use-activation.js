import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../../../lib/axios-config';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export function useActivation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (body) => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await axiosInstance.post('/auth/users/activation/', body, config);
      return response.data;
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        console.error('Error activating resource: ', error.response?.data || 'Failed to activate user.');
        return error.response?.data || null;
      }
    }
  });
}