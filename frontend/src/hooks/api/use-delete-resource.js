import { useState } from 'react';

import { deleteResourceById } from '../../actions/api';

export function useDeleteResource(initial) {
    const [isDeleted, setIsDeleted] = useState(initial);

    function handleDelete(resource, pid) {
        deleteResourceById(resource, pid).then((response) => {
            if(response && response.status === 204) {
                setIsDeleted(true);
            }
        });
    }

    return [isDeleted, handleDelete];
}