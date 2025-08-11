import {
  useMutation
} from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import { AxiosError } from 'axios';

export function useRegister() {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`/auth/users/`, body);
      return response.data;
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        console.error('Error registering user: ', error.response?.data || 'Failed to register user.');
        return error.response?.data;
      }
    }
  });
}