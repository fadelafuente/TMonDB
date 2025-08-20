import { useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';
import { useFormData } from '../../../hooks/form/use-form-data';
import { useRequestSent } from '../../../hooks/auth/helpers/use-request-sent';
import { useResetLoginConfirm } from '../../../hooks/features/user/auth/use-reset-login-confirm';

export default function ResetEmailConfirmComponent() {
  const { uid, token } = useParams();
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useFormData({
    new_email: '',
    re_new_email: '',
  });
  const { mutate: resetLoginConfirm } = useResetLoginConfirm();
  useRequestSent(requestSent);

  const { new_email, re_new_email } = formData;

  function onSubmit(e) {
    e.preventDefault();

    resetLoginConfirm({ uid, token, kwargs: formData, reset_type: 'email' });
    setRequestSent(true);
  }

  return (
    <div className='form-container'>
      <h2 className='form-title'>Enter New Email</h2>
      <Form className='form' onSubmit={(e) => onSubmit(e)}>
        <Form.Group controlId='email-input' className='form-group'>
          <InputGroup>
            <Form.Control
              type='email'
              placeholder='New Email'
              name='new_email'
              value={new_email}
              onChange={(e) => setFormData(e)}
              required
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='re-email-input' className='form-group'>
          <InputGroup>
            <Form.Control
              type='email'
              placeholder='Confirm New Email'
              name='re_new_email'
              value={re_new_email}
              onChange={(e) => setFormData(e)}
              required
            />
          </InputGroup>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Set Email
        </Button>
      </Form>
    </div>
  );
}