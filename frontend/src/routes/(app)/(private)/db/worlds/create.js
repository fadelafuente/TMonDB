import { useCreateResource } from '../../../../../hooks/features/api/use-create-resource';
import WorldForm from '../../../../../components/Forms/WorldForm';

export default function CreateWorldComponent() {
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
  
  return (
    <>
      <div className='article-container'>
        <h2 className='bottom-barrier'>Create a New World</h2>
      </div>
      <WorldForm formData={ formData } resetFormData={ resetFormData } setFormData={ setFormData } />
    </>
  );
}