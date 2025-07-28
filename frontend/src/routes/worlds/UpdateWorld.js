import { connect } from 'react-redux';
import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import WorldForm from '../../components/Forms/WorldForm';
import SpinningLoader from '../../components/Loader/SpinningLoader';
import { useUpdateResource } from '../../hooks/features/api/use-update-resource';
import { useGetResourceById } from '../../hooks/features/api/use-get-resource-by-id';

export default function UpdateWorld() {
  const { id } = useParams();
  const { isAuthenticated } = useOutletContext();
  const { data: world, isLoading } = useGetResourceById('worlds', id);
  const [formData, resetFormData, setFormData, setInitialForm] = useUpdateResource({
    name: world.name ||'',
    description: world.description || '',
    move_alias: world.move_alias || '',
    course_alias: world.course_alias || '',
    evolution_alias: world.evolution_alias || '',
    monster_alias: world.monster_alias || '',
    ability_alias: world.ability_alias || '',
    level_cap: world.level_cap || 100
  }, 'worlds', id);

  if(isLoading) {
    return <div className='loading-container'>
      <SpinningLoader />
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>
      <div className='article-container'>
        <h2 className='bottom-barrier'>Create a New World</h2>
      </div>
      <WorldForm formData={ formData } resetFormData={ resetFormData } setFormData={ setFormData } />
    </>
  );
}