import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.post('/auth/jwt/create/', body);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('access', data.access);
      navigate('/');
    },
    onError: (error) => {
      localStorage.removeItem('access');
      if(error instanceof AxiosError) {
        console.error('Error activating resource: ', error.response?.data || 'Failed to activate user.');
        return null;
      }
    }
  });
}