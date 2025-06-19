import { useEffect } from 'react';

import MonsterForm from '../Forms/MonsterForm';
import LoadingCard from '../Cards/LoadingCard';
import { FailedCard } from '../Cards/FailedCard';
import { useGetResourceById } from '../../hooks/api/use-get-resource-by-id';
import { useUpdateResource } from '../../hooks/api/use-update-resource';

export default function UpdateMon() {
        const [monster] = useGetResourceById('monsters');
        const [formData, resetFormData, setFormData, setInitialData] = useUpdateResource({
            name: '',
            national_id: '',
            species: '',
            description: '',
            etymology: '',
            avg_weight: '',
            avg_height: ''
        });

        useEffect(() => {
            setInitialData({
                name: monster.name ? monster.name : '',
                national_id: monster.national_id ? monster.national_id : '',
                species: monster.species ? monster.species : '',
                description: monster.description ? monster.description : '',
                etymology: monster.etymology ? monster.etymology : '',
                avg_weight: monster.avg_weight ? monster.avg_weight : '',
                avg_height: monster.avg_height ? monster.avg_height : ''
            });
        }, [monster])
        
        if(monster && typeof monster === 'object') {
            return (
                <>
                    <MonsterForm action='update' formData={ formData } resetFormData={ resetFormData } setFormData={ setFormData } />
                </>
            );
        } else if(monster === '') {
            return <LoadingCard />
        } else {
            <FailedCard type='monster' />
        }
}