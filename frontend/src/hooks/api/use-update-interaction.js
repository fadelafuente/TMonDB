import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios-config';
import { AxiosError } from 'axios';

export function useUpdateInteraction(resource = 'posts') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ interaction_type, id }) => {
      const response = await axiosInstance.patch(`api/${resource}/${id}/${interaction_type}/`, {});
      return response.data;
    },
    onSuccess: (response) => {
      if(response && response.status === 200) {
        queryClient.invalidateQueries({ queryKey: [resource] });
      }
    },
    onError: (error) => {
      if(error instanceof AxiosError) {
        console.error('Error creating resource: ', error.response?.data?.message || 'Failed to update resource.');
        return null;
      }
    }
  });
}