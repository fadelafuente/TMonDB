import { Modal, InputGroup, Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsExclamationCircle, BsEyeFill, BsEyeSlash } from 'react-icons/bs';
import { useTimedAlert } from '../../hooks/misc/use-timed-alert';
import { usePassword } from '../../hooks/auth/helpers/use-password';
import { useFormData } from '../../hooks/form/use-form-data';
import { deleteUser, logout } from '../../actions/auth';
import { connect } from 'react-redux';
import { useState } from 'react';

import '../../assets/styling/Modal.css';

function DeleteResourceModal({show, setShow, label, handleDelete}) {
  const [showAlert, setShowAlert] = useTimedAlert(false);
  const [message, setMessage] = useState('');
  
  return (
    <>
      <Alert show={ showAlert } 
        severity='error' 
        onClose={ () => { setShowAlert(false); setMessage(''); }}
        className='delete-alert'
      >
        <div className='row-gap-container'>
          <div className='interaction-icon error-icon'>
            <BsExclamationCircle />
          </div>
          <div>
            { message ? message : 'Failed to delete user.' }
          </div>
        </div>
      </Alert>
      <Modal className='reset-modal' backdrop='static' backdropClassName='modal-backdrop' show={show} centered>
        <Modal.Header>
          Are you sure you want to delete your { label }? This action cannot be undone.
        </Modal.Header>
        <Modal.Footer className='row-gap-container'>
          <Button className='base-btn' onClick={ () => {setShow(false) } }>Nevermind</Button>
          <Button 
            className='base-btn delete-btn' 
            variant='primary' type='submit'
            onClick={ handleDelete }
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(DeleteResourceModal);