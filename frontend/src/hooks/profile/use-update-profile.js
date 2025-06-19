import { updateDetails } from '../../actions/auth';
import { useFormData } from '../form/use-form-data';

export function useUpdateProfile(initialForm) {
    const [formData, setFormData] = useFormData(initialForm);

    function handleFormData(e, resetPost=false) {
        if(e.target.id === 'auto-resizing') {
            const textarea = document.getElementById('auto-resizing');
            textarea.addEventListener('input', autoResize, false);
            function autoResize() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            }
        }
        setFormData(e, resetPost);
    }

    function handleUpdateProfile(e, bio) {
        e.preventDefault();

        if(bio) {
            updateDetails({bio});
        }
    }

    return [formData, handleFormData, handleUpdateProfile];
}