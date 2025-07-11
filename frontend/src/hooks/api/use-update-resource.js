import { useNavigate, useParams } from 'react-router-dom';
import { updateResourceById } from '../../actions/api';
import { useAdaptiveFormData } from '../form/use-adaptive-formdata';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios-config';
import { AxiosError } from 'axios';

function useUpdateResourceHelper(resource = 'posts') {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.patch(`api/${resource}/${id}/`, body);
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

export function useUpdateResource(initialForm, resource = 'posts') {
  const [formData, setFormData, setInitialForm] = useAdaptiveFormData(initialForm);  
  const { mutate } = useUpdateResourceHelper(resource);

  function handleUpdateResource(e, data) {
    e.preventDefault();

    if(data) {
      mutate(data);
    }
  }

  return [formData, setFormData, handleUpdateResource, setInitialForm];
}