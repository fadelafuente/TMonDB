import { useState } from 'react';
import { handleValidation } from '../../functions/handlers';

export function useFormData(initialForm) {
    const [formData, setFormData] = useState(initialForm);

    function handleChange(e, resetForm=false) {
        if(resetForm) {
            setFormData(initialForm);
        } else {
            if(e.target.id === 'username-input') {
                e.target.value = e.target.validity.valid || e.target.value === '' ? e.target.value : formData['username'];
            }

            setFormData({ ...formData, [e.target.name]: e.target.value });

            if(e.target.id === 'password-input') {
                handleValidation(e.target.value);
            }
        }
    }

    return [formData, handleChange, setFormData];
}