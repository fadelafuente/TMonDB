import { useNavigate } from 'react-router-dom';
import { useAdaptiveFormData } from '../../form/use-adaptive-formdata';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axios-config';
import { AxiosError } from 'axios';
import getApiHeaders from '../../../lib/api-config';

function useUpdateResourceHelper(resource = 'posts', id) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) => {
      const config = { headers: getApiHeaders() };
      const response = await axiosInstance.patch(`/api/${resource}/${id}/`, body, config);
      return response;
    },
    onSuccess: (response) => {
      if(response && response.status === 200) {
        queryClient.invalidateQueries({ queryKey: [resource, id] });
        queryClient.refetchQueries();
        navigate(`/${resource}/${response.data['id']}`);
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

export function useUpdateResource(initialForm, resource = 'posts', id) {
  const [formData, setFormData, setInitialForm] = useAdaptiveFormData(initialForm);
  const { mutate } = useUpdateResourceHelper(resource, id);

  function handleUpdateResource(e, data) {
    e.preventDefault();

    if(data) {
      mutate(data);
    }
  }

  return [formData, setFormData, handleUpdateResource, setInitialForm];
}