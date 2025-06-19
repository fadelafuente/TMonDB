import { useFormData } from './use-form-data';

export function useAdaptiveFormData(initialForm) {
    const [formData, setFormData, setInitialData] = useFormData(initialForm);

    function handleFormData(e, resetPost=false) {
        if(e.target.id === 'auto-resizing') {
            const textarea = e.target;

            function autoResize() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            }

            textarea.addEventListener('input', autoResize, false);
        }
        setFormData(e, resetPost);
    }

    return [formData, handleFormData, setInitialData];
}