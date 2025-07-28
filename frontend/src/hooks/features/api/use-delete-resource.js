import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';

export function useDeleteResource(resource = 'posts') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`api/${resource}/${id}/`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      queryClient.refetchQueries();
    },
    onError: (error) => {
      console.error('Error deleting resource:', error.response || error.message || 'Unknown error');
      return false;
    },
  });
}