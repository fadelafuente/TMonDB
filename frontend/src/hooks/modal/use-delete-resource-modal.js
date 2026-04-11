import { useState } from 'react';
import { useDeleteResource } from '../features/api/use-delete-resource';

export function useDeleteResourceModal(resource = 'posts', data) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { data: isDeleted, mutate: deleteResource } = useDeleteResource(resource);

  function handleDeleteResource() {
    setOpenDeleteModal(() => {
      deleteResource(data.id);
      return false;
    });
  }

  return { openDeleteModal, isDeleted, setOpenDeleteModal, handleDeleteResource};
}