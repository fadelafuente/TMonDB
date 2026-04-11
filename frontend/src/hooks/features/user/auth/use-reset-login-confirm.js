import {
  useMutation
} from '@tanstack/react-query';
import { axiosInstance } from '../../../../lib/axios-config';
import { AxiosError } from 'axios';

export function useResetLoginConfirm() {
  return useMutation({
    mutationFn: async ({ uid, token, kwargs={}, reset_type='password' }) => {
      const body = JSON.stringify({ uid, token, ...kwargs });
      const response = await axiosInstance.post(`/auth/users/reset_${reset_type}_confirm/`, body);
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