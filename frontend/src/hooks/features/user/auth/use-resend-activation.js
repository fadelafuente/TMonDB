import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../../../lib/axios-config';
import { AxiosError } from 'axios';

export function useResendActivation() {
  return useMutation({
    mutationFn: async (body) => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await axiosInstance.post('/auth/users/resend_activation/', body, config);
      return response.data;
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        console.error('Error activating resource: ', error.response?.data || 'Failed to resend activation email.');
        return error.response?.data || 'Failed to resend activation email.';
      }
    }
  });
}