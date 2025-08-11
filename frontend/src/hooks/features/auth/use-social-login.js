import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export function useSocialLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ state, code, provider }) => {
      const details = {
        'state': state,
        'code': code
      };
      const body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

      const response = await axiosInstance.post(`/auth/o/${provider}/?${body}`);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('access', data.access);
      navigate('/');
    },
    onError: (error) => {
      localStorage.removeItem('access');
      if(error instanceof AxiosError) {
        console.error('Error Logging in: ', error.response?.data || 'Failed to log user in.');
        return null;
      }
    }
  });
}