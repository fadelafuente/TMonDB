import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { setLoginByEmail } from "../../actions/auth";
import { connect } from "react-redux";

import '../../assets/styling/Modal.css';

function ResetModal({setLoginByEmail, resetItem, show, setShow, email}) {
    function handleClick(e) {
        e.preventDefault();

        setLoginByEmail(email, resetItem);
        
        setShow(false);
    }

    return <>
        <Modal className="reset-modal" backdrop="static" backdropClassName="modal-backdrop" show={show} size="sm" centered>
            <Modal.Header>
                <h5>Set your {resetItem}</h5>
            </Modal.Header>
            <Modal.Body>
                <div  className="reset-body">
                    To change your {resetItem}, a {resetItem} reset link will be sent to your email first.
                </div>
            </Modal.Body>
            <Modal.Footer className="row-gap-container outer-modal-footer">
                <Button className="base-btn" onClick={ e => setShow(false) }>Nevermind</Button>
                <Button 
                    className="base-btn" 
                    onClick={ e => handleClick(e) }
                >
                    Send link
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default connect(null, { setLoginByEmail })(ResetModal);