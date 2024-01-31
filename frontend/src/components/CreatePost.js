import { Modal, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsImages } from "react-icons/bs";
import { handleCreatePost } from "../functions/handlers";
import { DiscardModal } from "./DiscardModal";
import { useCreatePost, useDiscardModal } from "../hooks/hooks";

export default function CreatePost({show, setShow}) {
    const initialForm = {
        content: ''
    };

    const [formData, setFormData] = useCreatePost(initialForm);
    const [showDiscard, setShowDiscard] = useDiscardModal(formData, setShow);
    
    const { content } = formData;

    return (
        <>
            <Modal 
                className="create-post"
                show={show}
            >
                <Modal.Header>
                    placeholderUserName
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="auto-resizing">
                        <Form.Control 
                            as="textarea"
                            className="input-textarea" 
                            placeholder="howdy! What will you say?"
                            value={ content }
                            name="content"
                            onChange={ e => setFormData(e) } 
                        />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Row className="no-select">
                            <Col><Button className="svg-btn media-btn center-content"><BsImages/></Button></Col>
                        </Row>
                    </Col>
                        <Button 
                            className="rounded-btn close-btn" 
                            id="discard-post-btn"
                            onClick={ e => setShowDiscard(e) }
                        >
                            Close
                        </Button>
                        <Button className="rounded-btn" onClick={e => handleCreatePost(e, content, setShow, setFormData)}>Post</Button>
                </Modal.Footer>
            </Modal>
            <DiscardModal setShowDiscard={setShowDiscard} showDiscard={showDiscard} setFormData={setFormData} />
        </>
    )
}