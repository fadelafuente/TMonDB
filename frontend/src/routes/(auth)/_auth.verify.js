import { useState } from 'react';
import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-router-dom';

import Toaster from '../../components/Toaster';
import { useEmailFromLocation } from '../../hooks/auth/helpers/use-email-from-location';
import { useFailedSocialAuth } from '../../hooks/auth/helpers/use-failed-social-auth';
import { useResendActivation } from '../../hooks/features/user/auth/use-resend-activation';

export default function VerifyEmailComponent() {
  const email = useEmailFromLocation();
  useFailedSocialAuth( email );
  const { mutate: resendActivation } = useResendActivation();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  function handleSubmit() {
    resendActivation({ email }, {
      onSuccess: () => {
        setMessage('Activation email resent successfully. If you do not see it, check your spam folder and that the email is correct.');
        setShow(true);
      },
      onError: () => {
        setMessage('Failed to resend activation email.');
        setShow(true);
      }
    });
  }

  return (
    <div className='form-container verify-container'>
      <Toaster
        show={ show }
        onClose={ () => setShow(false) }
        message={ message }
        title='Activation Email'
      />
      <h2 className='form-title'>Please verify your email</h2>
      <Form className='form'>
        <FormText id='centered-text'>
          An email was sent to
          <p>
            <strong>{ email }</strong>
          </p>
          Click on the link to verify your email and activate your account.
        </FormText>
        <Button type='submit' onClick={ handleSubmit }>
          Resend Activation Email
        </Button>
      </Form>
    </div>
  );
}