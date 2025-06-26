import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useCreateResource } from '../../hooks/api/use-create-resource';
import WorldForm from '../../components/Forms/WorldForm';
import SpinningLoader from '../../components/Loader/SpinningLoader';

function CreateWorld({ isAuthenticated }) {
  const [formData, resetFormData, setFormData] = useCreateResource({
    name: '',
    description: '',
    move_alias: '',
    course_alias: '',
    evolution_alias: '',
    monster_alias: '',
    ability_alias: '',
    level_cap: 100
  });

  if(isAuthenticated === null) {
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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(CreateWorld);