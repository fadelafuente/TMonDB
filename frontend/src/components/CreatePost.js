import { Modal, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsImages } from "react-icons/bs";
import { DiscardModal } from "./DiscardModal";
import { useCreatePost, useDiscardModal } from "../hooks/hooks";

export default function CreatePost({show, setShow, is_reply=false, parent=null}) {
    const initialForm = {
        content: ''
    };

    const [formData, resetFormData, setFormData] = useCreatePost(initialForm);
    const [showDiscard, setShowDiscard] = useDiscardModal(formData, setShow);
    
    const { content } = formData;

    return (
        <>
            <Modal 
                className="create-post"
                show={show}
            >
                <Modal.Header>
                    Create post
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
                            onChange={ e => resetFormData(e) } 
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
                        <Button className="rounded-btn" onClick={e => {
                                setFormData(e, content, is_reply, parent);
                                setShow(false);
                            }}>
                            Post
                        </Button>
                </Modal.Footer>
            </Modal>
            <DiscardModal setShowDiscard={setShowDiscard} showDiscard={showDiscard} resetFormData={resetFormData} />
        </>
    )
}