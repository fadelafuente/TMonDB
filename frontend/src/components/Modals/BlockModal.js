import { Modal } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { patchCurrentUsersBlockedList } from "../../actions/auth";

export default function BlockModal({show, setShow, setBlocked, username}) {
    return <>
        <Modal className="discard-post" backdrop="static" backdropClassName="modal-backdrop" show={show} size="sm" centered>
            <Modal.Header>Block @{username}?</Modal.Header>
            <Modal.Body>
                    The user will not be able to follow you, or view your posts.
            </Modal.Body>
            <Modal.Footer>
                <Button className="rounded-btn close-btn" onClick={ () => setShow(false) }>Cancel</Button>
                <Button 
                    className="rounded-btn" 
                    onClick={ username ? 
                        () => { patchCurrentUsersBlockedList(username); setBlocked((prev) => !prev); setShow(false); } 
                    : 
                        () => {}
                    }
                >
                    Block
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export function UnBlockModal({show, setShow, setBlocked, username}) {
    return <>
        <Modal className="discard-post" backdrop="static" backdropClassName="modal-backdrop" show={show} size="sm" centered>
            <Modal.Header className="modal-header-no-border">Unblock @{username}?</Modal.Header>
            <Modal.Footer>
                <Button className="rounded-btn close-btn" onClick={ () => setShow(false) }>Cancel</Button>
                <Button 
                    className="rounded-btn" 
                    onClick={ username ? 
                        () => { patchCurrentUsersBlockedList(username); setBlocked((prev) => !prev); setShow(false); } 
                    : 
                        () => {}
                    }
                >
                    UnBlock
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}