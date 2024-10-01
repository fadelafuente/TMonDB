import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { DiscardModal } from "./DiscardModal";
import { useDiscardModal, useUpdateProfile } from "../../hooks/hooks";

import "../../assets/styling/Modal.css";

export default function EditModal({show, setShow}) {
    const initialForm = {
        bio: ''
    };

    const [formData, resetFormData, setFormData] = useUpdateProfile(initialForm);
    const [showDiscard, setShowDiscard] = useDiscardModal(formData, setShow);
    
    const { bio } = formData;
    
    function handleClick(e) {
        e.preventDefault();

        setFormData(e, bio);
        setShow(false);

        window.location.reload();
    }

    return <>
        <Modal className="reset-modal" backdrop="static" backdropClassName="modal-backdrop" show={show} size="sm" centered>
            <Modal.Header>
                    <h5 className="modal-title">Edit Profile</h5>
                </Modal.Header>
            <Modal.Body>
                    <Form>
                        <Form.Group controlId="auto-resizing">
                        <Form.Control 
                            as="textarea"
                            className="input-textarea" 
                            placeholder="This is a fantastic bio! A little empty though, no?"
                            value={ bio }
                            name="bio"
                            onChange={ e => resetFormData(e) } 
                        />
                        </Form.Group>
                    </Form>
                    <Modal.Footer className="row-gap-container">
                        <Button className="base-btn" onClick={ e => setShowDiscard(e) }>Cancel</Button>
                        <Button 
                            className="base-btn" 
                            onClick={ e => handleClick(e) }
                        >
                            Save
                        </Button>
                    </Modal.Footer>
            </Modal.Body>
        </Modal>
        <DiscardModal setShowDiscard={setShowDiscard} showDiscard={showDiscard} resetFormData={resetFormData} discard_type="bio" />
    </>
}