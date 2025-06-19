import { useNavigate, useParams } from 'react-router-dom';
import { updateResourceById } from '../../actions/api';
import { useAdaptiveFormData } from '../form/use-adaptive-formdata';

export function useUpdateResource(initialForm) {
    const [formData, setFormData, setInitialData] = useAdaptiveFormData(initialForm);
    const navigate = useNavigate();
    const { id } = useParams();

    function handleUpdateResource(e, resource, data) {
        e.preventDefault();

        if(data) {
            updateResourceById(resource, id, data).then(response => {
                if(response && response.status === 200) {
                    navigate(`/${resource}/${response.data['id']}`);
                }
            });
        }
    }

    return [formData, setFormData, handleUpdateResource, setInitialData];
}