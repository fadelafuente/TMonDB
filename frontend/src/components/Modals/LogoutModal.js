import { Modal, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { useLogout } from "../../hooks/features/auth/use-logout";

export function LogoutModal({show, setShow}) {
  const { mutate: logout } = useLogout();

  function handleLogout() {
    logout(null, {
      onSuccess: () => {
        setShow(false);
      }
    });
  }

  return <>
    <Modal className="discard-post" backdrop="static" backdropClassName="modal-backdrop" show={ show } size="sm" centered>
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to logout? Any unsaved changes will be lost.
      </Modal.Body>
      <Modal.Footer className="row-gap-container center-content">
        <Button variant="secondary" className="base-btn" onClick={ () => setShow(false) }>
          Close
        </Button>
        <Button variant="primary" className="base-btn" onClick={ handleLogout }>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}