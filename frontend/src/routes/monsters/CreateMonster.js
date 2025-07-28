import { Navigate, useOutletContext } from 'react-router-dom';
import { useCreateResource } from '../../hooks/features/api/use-create-resource';
import MonsterForm from '../../components/Forms/MonsterForm';

export default function CreateMon() {
  const { isAuthenticated } = useOutletContext();
  const [formData, resetFormData, setFormData] = useCreateResource({
    name: '',
    national_id: '',
    species: '',
    description: '',
    etymology: '',
    avg_weight: '',
    avg_height: '',
  });

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>
      <MonsterForm
        action='create'
        formData={ formData }
        resetFormData={ resetFormData }
        setFormData={ setFormData }
      />
    </>
  );
}
