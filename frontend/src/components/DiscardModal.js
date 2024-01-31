import { Modal, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

export function DiscardModal({showDiscard, setShowDiscard, setFormData}) {
    return <>
        <Modal className="discard-post" backdrop="static" backdropClassName="modal-backdrop" show={showDiscard} size="sm" centered>
            <Modal.Body>
                    <Row>
                        <h4>
                            Discard this post?
                        </h4>
                    </Row>
                    <Row className="center-content">
                        <Button className="rounded-btn close-btn" onClick={ e => setShowDiscard(e, false) }>Cancel</Button>
                        <Button 
                            className="rounded-btn" 
                            onClick={ e => setShowDiscard(e, setFormData) }
                        >
                            Discard
                        </Button>
                    </Row>
            </Modal.Body>
        </Modal>
    </>
}