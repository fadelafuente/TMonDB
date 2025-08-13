import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFormData } from '../../hooks/form/use-form-data';
import { useRequestSent } from '../../hooks/auth/helpers/use-request-sent';
import { useResetLogin } from '../../hooks/features/user/auth/use-reset-login';

export default function LoginChange({ reset_type = 'password' }) {
  const [requestSent, setRequestSent] = useState(false);
  const { mutate: resetLogin } = useResetLogin();
  const [formData, setFormData] = useFormData({
    email: '',
  });
  useRequestSent(requestSent);

  const { email } = formData;

  function onSubmit(e) {
    e.preventDefault();

    resetLogin({ email, reset_type });
    setRequestSent(true);
  }

  return (
    <div className='form-container'>
      <h2 className='form-title'>Request { reset_type } change</h2>
      <Form className='form' onSubmit={ (e) => onSubmit(e) }>
        <Form.Group controlId='formEmail' className='form-group'>
          <Form.Control
            type='email'
            placeholder='Email'
            name='email'
            value={ email }
            onChange={ (e) => setFormData(e) }
            required
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Request change
        </Button>
      </Form>
    </div>
  );
}