import { useNavigate } from 'react-router-dom';

import { createResource } from '../../actions/api';
import { useAdaptiveFormData } from '../form/use-adaptive-formdata';

export function useCreateResource(initialForm) {
    const [formData, setFormData] = useAdaptiveFormData(initialForm);
    const navigate = useNavigate();

    function handleCreateResource(e, resource, data) {
        e.preventDefault();

        if(data) {
            createResource(resource, data).then(response => {
                if(response && response.status === 201) {
                    if(resource === 'posts') {
                        navigate(`/${response.data['article']['creator']['username']}/${response.data['id']}`);
                    } else {
                        navigate(`/${resource}/${response.data['id']}`);
                    }
                }
            });
        }
    }

    return [formData, setFormData, handleCreateResource];
}