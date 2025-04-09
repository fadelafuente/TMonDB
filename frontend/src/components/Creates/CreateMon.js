import React from 'react';

import { useCreateResource } from '../../hooks/hooks';
import MonsterForm from '../Forms/MonsterForm';

export default function CreateMon() {
    const [formData, resetFormData, setFormData] = useCreateResource({
        name: '',
        national_id: '',
        species: '',
        description: '',
        etymology: '',
        avg_weight: '',
        avg_height: ''
    });
    
    return (
        <>
            <MonsterForm action='create' formData={ formData } resetFormData={ resetFormData } setFormData={ setFormData } />
        </>
    );
}