import { useNavigate } from 'react-router-dom';

import { useAdaptiveFormData } from '../../form/use-adaptive-formdata';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';

function useCreateResourceHelper(resource = 'posts') {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`api/${resource}/`, body);
      return response;
    }
  });
}

export function useCreateResource(initialForm, resource = 'posts') {
  const [formData, setFormData] = useAdaptiveFormData(initialForm);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useCreateResourceHelper(resource);

  function handleCreateResource(e, data) {
    e.preventDefault();

    if(data) {
      mutate(data, {
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: [resource] });
          queryClient.refetchQueries();
          if(resource === 'posts') {
            navigate(`/${response.data['article']['creator']['username']}/${response.data['id']}`);
          } else {
            navigate(`/${resource}/${response.data['id']}`);
          }
        },
        onError: (error) => {
          console.error('Error creating resource:', error.response || error.message || 'Unknown error');
        }
      });
    }
  }

  return [formData, setFormData, handleCreateResource];
}