import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';

import { useActivation } from '../../hooks/features/user/auth/use-activation';

import '../../assets/styling/forms.css';

export async function action() {
  return null;
}

export default function ActivateComponent() {
  const { uid, token } = useParams();
  const { mutate: verify } = useActivation();

  function verify_account(e) {
    e.preventDefault();

    verify({ uid, token });
  }

  return (
    <div className='form-container'>
      <h2 className='form-title'>Verify Your Account</h2>
      <Form className='form' onSubmit={ (e) => verify_account(e) }>
        <Button variant='primary' type='submit'>
          Verify
        </Button>
      </Form>
    </div>
  );
}