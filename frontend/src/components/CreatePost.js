import { useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsImages } from "react-icons/bs";
import { handleDiscard, handleContentChange, HandleCreateClose } from "../functions/handlers";

export default function CreatePost({show, setShow}) {
    const [show_discard, setShowDiscard] = useState(false);
    const [content, setContent] = useState("");

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
                        <Row>
                            <Col>
                            <span 
                                className="input-content" 
                                placeholder="howdy! What will you say?" 
                                contentEditable="true"
                                id="content-text"
                                onInput={e => handleContentChange(e, setContent)}
                            ></span>
                            </Col>
                        </Row>
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
                            onClick={ () => HandleCreateClose(setShow, setShowDiscard, content) }
                        >
                            Close
                        </Button>
                        <Button className="rounded-btn" onClick={() => console.log(content)}>Post</Button>
                </Modal.Footer>
            </Modal>
            <Modal className="discard-post" backdrop="static" backdropClassName="modal-backdrop" show={show_discard} size="sm" centered>
                <Modal.Body>
                        <Row>
                            <h4>
                                Discard this post?
                            </h4>
                        </Row>
                        <Row className="center-content">
                            <Button className="rounded-btn close-btn" onClick={ () => setShowDiscard(false) }>Cancel</Button>
                            <Button 
                                className="rounded-btn" 
                                onClick={() => handleDiscard(setContent, setShowDiscard, setShow)}
                            >
                                Discard
                            </Button>
                        </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}