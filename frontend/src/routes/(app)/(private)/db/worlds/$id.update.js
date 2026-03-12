import { useParams } from 'react-router-dom';
import WorldForm from '../../../../../components/Forms/WorldForm';
import SpinningLoader from '../../../../../components/Loader/SpinningLoader';
import { useUpdateResource } from '../../../../../hooks/features/api/use-update-resource';
import { useGetResourceById } from '../../../../../hooks/features/api/use-get-resource-by-id';

function UpdateWorldInnerComponent({ world, id }) {
  const [formData, resetFormData, setFormData] = useUpdateResource({
    name: world?.name ||'',
    description: world?.description || '',
    move_alias: world?.move_alias || '',
    course_alias: world?.course_alias || '',
    evolution_alias: world?.evolution_alias || '',
    monster_alias: world?.monster_alias || '',
    ability_alias: world?.ability_alias || '',
    level_cap: world?.level_cap || 100,
    properties: world?.properties || []
  }, 'worlds', id);

  return (
    <>
      <div className='article-container'>
        <h2 className='bottom-barrier'>Update your World</h2>
      </div>
      <WorldForm
        formData={ formData }
        resetFormData={ resetFormData }
        setFormData={ setFormData }
      />
    </>
  );
}

export default function UpdateWorldComponent() {
  const { id } = useParams();
  const { data: world, isLoading } = useGetResourceById('worlds', id);

  if(isLoading) {
    return <div className='loading-container'>
      <SpinningLoader />
    </div>
  }

  return (
    <>
      <div>
        <UpdateWorldInnerComponent world={ world } id={ id } />
      </div>
    </>
  );
}