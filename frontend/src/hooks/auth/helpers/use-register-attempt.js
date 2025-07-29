import { useState } from 'react';

export function useRegisterAttempt() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  function registerAttempt(response) {
    if (typeof response == 'string') {
      const element = new DOMParser()
        .parseFromString(response, 'text/html')
        .getElementsByClassName('exception_value');
      const err_message = element[0].innerHTML.replace(/['']+/g, '');
      setMessage(err_message);
    } else if (typeof response == 'object') {
      const responseValues = Object.values(response);
      const err_message = responseValues[0];
      setMessage(err_message);
    } else {
      setMessage('');
    }
    setShow(true);
  }

  function resetRegisterAttempt() {
    setMessage('');
    setShow(false);
  }

  return [show, resetRegisterAttempt, message, registerAttempt];
}
