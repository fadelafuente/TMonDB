import { AxiosError } from 'axios';
import {
  useMutation
} from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import getApiHeaders from '../../../lib/api-config';

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const config = { headers: getApiHeaders() };
      const response = await axiosInstance.post(`/auth/users/logout/`, {}, config);
      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem('access');
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        console.error('Error creating resource: ', error.response?.data || 'Failed to update resource.');
        return error.response?.data;
      }
    }
  });
}