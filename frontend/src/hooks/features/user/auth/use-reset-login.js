import {
  useMutation
} from '@tanstack/react-query';
import { axiosInstance } from '../../../../lib/axios-config';
import { AxiosError } from 'axios';

export function useResetLogin() {
  return useMutation({
    mutationFn: async ({ email, reset_type }) => {
      const body = JSON.stringify({ email });
      const response = await axiosInstance.post(`/auth/users/reset_${reset_type}/`, body);
      return response.data;
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        console.error('Error resetting login credentials: ', error.response?.data || 'Failed to reset login credentials.');
        return error.response?.data;
      }
    }
  });
}