import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useCreateResource } from '../../hooks/api/use-create-resource';
import MonsterForm from '../../components/Forms/MonsterForm';
import SpinningLoader from '../../components/Loader/SpinningLoader';

function CreateMon({ isAuthenticated }) {
    const [formData, resetFormData, setFormData] = useCreateResource({
        name: '',
        national_id: '',
        species: '',
        description: '',
        etymology: '',
        avg_weight: '',
        avg_height: ''
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
            <MonsterForm action='create' formData={ formData } resetFormData={ resetFormData } setFormData={ setFormData } />
        </>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(CreateMon);