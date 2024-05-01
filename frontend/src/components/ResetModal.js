import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { setLoginByEmail } from "../actions/auth";
import { connect } from "react-redux";

import '../assets/styling/Modal.css';

function ResetModal({setLoginByEmail, resetItem, show, setShow, email}) {
    function handleClick(e) {
        e.preventDefault();

        setLoginByEmail(email, resetItem);
        
        setShow(false);
    }

    return <>
        <Modal className="reset-modal" backdrop="static" backdropClassName="modal-backdrop" show={show} size="sm" centered>
            <Modal.Body>
                    <Modal.Header>
                        <h5>Set your {resetItem}</h5>
                    </Modal.Header>
                   <div  className="reset-body">
                        To change your {resetItem}, a {resetItem} reset link will be sent to your email first.
                   </div>
                    <Modal.Footer>
                        <Button className="rounded-btn close-btn modal-btn" onClick={ e => setShow(false) }>Nevermind</Button>
                        <Button 
                            className="rounded-btn modal-btn" 
                            onClick={ e => handleClick(e) }
                        >
                            Send link
                        </Button>
                    </Modal.Footer>
            </Modal.Body>
        </Modal>
    </>
}

export default connect(null, { setLoginByEmail })(ResetModal);