import { React, useEffect, useState } from "react";

import '../assets/styling/forms.css';
import '../assets/styling/Account.css';
import { Button, Col, Row } from "react-bootstrap";
import ResetModal from "./ResetModal";
import SetUsernameNoRedirect from "./SetUsernameNoRedirect";
import DeleteModal from "./DeleteModal";
import { useNavigateNotAuth } from "../hooks/hooks";

import "../assets/styling/PostCard.css";
import "../assets/styling/Modal.css";
import { connect } from "react-redux";

function Account({isAuthenticated, user}) {
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [resetItem, setResetItem] = useState("");
    const [editUsername, setEditUsername] = useState(false);
    const [name, setName] = useState(user ? user.username : "");
    useNavigateNotAuth(isAuthenticated);

    useEffect(() => {
        if(user && name === "")
            setName(user.username);
    }, [user, name]);

    return (
        <>
            <ResetModal resetItem={resetItem} show={show} setShow={setShow} email={user ? user.email : ""} />
            <DeleteModal show={showDelete} setShow={setShowDelete} />
            <div className="profile-info-container">
                <h3>My Account</h3>
                <div className="section-container">
                    <h5>Email</h5>
                    <Row>
                        <Col>
                            { user ? 
                                user.email.length > 50 ? `${user.email.slice(0, 20)}...` : user.email
                            : "" }
                        </Col>
                        <Col className="edit-col">
                            <button className="svg-btn bg-btn" onClick={() => { setResetItem("email"); setShow(true); } }>
                                edit
                            </button>
                        </Col>
                    </Row>
                </div>
                <div className="section-container">
                    <h5>Username</h5>
                    <div className="edit-username-container">
                        { editUsername ? 
                            <SetUsernameNoRedirect 
                                handleEditUsername={ () => setEditUsername() } 
                                handleUsername={ (name) => setName(name) } 
                            />
                        :
                            <Row>
                                <Col>
                                    { name }
                                </Col>
                                <Col className="edit-col">
                                    <button className="svg-btn" onClick={() => setEditUsername(true) }>
                                        edit
                                    </button>
                                </Col>
                            </Row>
                        }
                    </div>
                </div>
                <div className="section-container">
                    <h5>Password</h5>
                    <Row>
                        <Col>
                            ************
                        </Col>
                        <Col className="edit-col">
                            <button className="svg-btn bg-btn" onClick={() => { setResetItem("password"); setShow(true); } }>
                                edit
                            </button>
                        </Col>
                    </Row>
                </div>
                <div className="section-container">
                    <Row>
                        <Col>
                            <h5>Delete Account</h5>
                        </Col>
                        <Col className="edit-col">
                            <Button className="delete-btn" onClick={ () => setShowDelete(true) }>Delete</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(Account);