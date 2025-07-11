import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import MonsterForm from '../../components/Forms/MonsterForm';
import LoadingCard from '../../components/Cards/LoadingCard';
import { FailedCard } from '../../components/Cards/FailedCard';
import { useGetResourceById } from '../../hooks/api/use-get-resource-by-id';
import { useUpdateResource } from '../../hooks/api/use-update-resource';
import SpinningLoader from '../../components/Loader/SpinningLoader';

function UpdateMon({ isAuthenticated }) {
  const { id } = useParams();
  const { data: monster, isLoading: loading } = useGetResourceById('monsters', id);
  const [formData, resetFormData, setFormData, setInitialForm] = useUpdateResource({
    name: monster.name ? monster.name : '',
    national_id: monster.national_id ? monster.national_id : '',
    species: monster.species ? monster.species : '',
    description: monster.description ? monster.description : '',
    etymology: monster.etymology ? monster.etymology : '',
    avg_weight: monster.avg_weight ? monster.avg_weight : '',
    avg_height: monster.avg_height ? monster.avg_height : ''
  }, 'monsters');

  useEffect(() => {
    setInitialForm({
      name: monster.name ? monster.name : '',
      national_id: monster.national_id ? monster.national_id : '',
      species: monster.species ? monster.species : '',
      description: monster.description ? monster.description : '',
      etymology: monster.etymology ? monster.etymology : '',
      avg_weight: monster.avg_weight ? monster.avg_weight : '',
      avg_height: monster.avg_height ? monster.avg_height : ''
    });
  }, [monster, setInitialForm])

  if(loading || isAuthenticated === null) {
    return <div className='loading-container'>
      <SpinningLoader />
    </div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
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

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(UpdateMon);