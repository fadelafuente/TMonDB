import { Modal, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

export function DiscardModal({showDiscard, setShowDiscard, resetFormData, discard_type="post"}) {
    return <>
        <Modal className="discard-post" backdrop="static" backdropClassName="modal-backdrop" show={showDiscard} size="sm" centered>
            <Modal.Body>
                    <Row>
                        <h4>
                            Discard this {discard_type}?
                        </h4>
                    </Row>
                    <Row className="row-gap-container center-content">
                        <Button className="base-btn" onClick={ e => setShowDiscard(e, false) }>Cancel</Button>
                        <Button 
                            className="base-btn" 
                            onClick={ e => setShowDiscard(e, resetFormData) }
                        >
                            Discard
                        </Button>
                    </Row>
            </Modal.Body>
        </Modal>
    </>
}