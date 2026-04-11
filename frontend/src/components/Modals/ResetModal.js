import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useResetLogin } from '../../hooks/features/user/auth/use-reset-login';

import '../../assets/styling/Modal.css';

export default function ResetModal({ resetItem, show, setShow, email }) {
  const { mutate: resetLogin } = useResetLogin();

  function handleClick(e) {
    e.preventDefault();

    resetLogin({ email, reset_type: resetItem });

    setShow(false);
  }

  return (
    <>
      <Modal
        className='reset-modal'
        backdrop='static'
        backdropClassName='modal-backdrop'
        show={ show }
        size='sm'
        centered
      >
        <Modal.Header>
          <h5>Set your { resetItem }</h5>
        </Modal.Header>
        <Modal.Body>
          <div className='reset-body'>
            To change your { resetItem }, a { resetItem } reset link will be sent to
            your email first.
          </div>
        </Modal.Body>
        <Modal.Footer className='row-gap-container outer-modal-footer'>
          <Button className='base-btn' onClick={ () => setShow(false) }>
            Nevermind
          </Button>
          <Button className='base-btn' onClick={ (e) => handleClick(e) }>
            Send link
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}