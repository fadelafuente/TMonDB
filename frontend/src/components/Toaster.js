import { Toast, ToastContainer } from 'react-bootstrap';

export default function Toaster({ show, onClose, message, bg = 'secondary', title }) {
  return (
    <div>
      <ToastContainer position='bottom-end' className='p-3'>
        <Toast
          className="d-inline-block m-1"
          onClose={ onClose }
          show={ show }
          delay={ 5000 }
          autohide
          bg={ bg }
        >
          <Toast.Header closeButton={ false }>
            <strong className='me-auto'>{ title }</strong>
          </Toast.Header>
          <Toast.Body>{ message }</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}
