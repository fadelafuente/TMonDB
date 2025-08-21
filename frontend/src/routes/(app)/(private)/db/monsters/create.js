import { useCreateResource } from '../../../../../hooks/features/api/use-create-resource';
import MonsterForm from '../../../../../components/Forms/MonsterForm';

export default function CreateMonsterComponent() {
  const [formData, resetFormData, setFormData] = useCreateResource({
    name: '',
    national_id: '',
    species: '',
    description: '',
    etymology: '',
    avg_weight: '',
    avg_height: '',
  });

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