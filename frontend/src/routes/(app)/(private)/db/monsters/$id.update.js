import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MonsterForm from '../../../../../components/Forms/MonsterForm';
import LoadingCard from '../../../../../components/Cards/LoadingCard';
import { FailedCard } from '../../../../../components/Cards/FailedCard';
import { useGetResourceById } from '../../../../../hooks/features/api/use-get-resource-by-id';
import { useUpdateResource } from '../../../../../hooks/features/api/use-update-resource';
import SpinningLoader from '../../../../../components/Loader/SpinningLoader';

export default function UpdateMonsterComponent() {
  const { id } = useParams();
  const { data: monster, isLoading: loading } = useGetResourceById('monsters', id);
  const [formData, resetFormData, setFormData, setInitialForm] = useUpdateResource({
    name: monster?.name ? monster.name : '',
    national_id: monster?.national_id ? monster.national_id : '',
    species: monster?.species ? monster.species : '',
    description: monster?.description ? monster.description : '',
    etymology: monster?.etymology ? monster.etymology : '',
    avg_weight: monster?.avg_weight ? monster.avg_weight : '',
    avg_height: monster?.avg_height ? monster.avg_height : ''
  }, 'monsters', id);

  useEffect(() => {
    setInitialForm({
      name: monster?.name ? monster.name : '',
      national_id: monster?.national_id ? monster.national_id : '',
      species: monster?.species ? monster.species : '',
      description: monster?.description ? monster.description : '',
      etymology: monster?.etymology ? monster.etymology : '',
      avg_weight: monster?.avg_weight ? monster.avg_weight : '',
      avg_height: monster?.avg_height ? monster.avg_height : ''
    });
  }, [monster, setInitialForm])

  if(loading) {
    return <div className='loading-container'>
      <SpinningLoader />
    </div>
  }

  if(monster && typeof monster === 'object') {
    return (
      <>
        <MonsterForm action='update' formData={ formData } resetFormData={ resetFormData } setFormData={ setFormData } />
      </>
    );
  } else if(monster === '') {
    return (
      <div className='article-container'>
        <LoadingCard />
      </div>
    )
  } else {
    <FailedCard type='monster' />
  }
}