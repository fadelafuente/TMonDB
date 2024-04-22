import { React } from "react";

import '../assets/styling/forms.css';
import '../assets/styling/Account.css';
import { Button, Col, Row } from "react-bootstrap";
import { useCurrentUserDetails } from "../hooks/hooks";
import { connect } from "react-redux";

function Account({isAuthenticated}) {
    const [user] = useCurrentUserDetails(isAuthenticated);

    return (
        <>
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
                            edit
                        </Col>
                    </Row>
                </div>
                <div className="section-container">
                    <h5>Username</h5>
                    <Row>
                        <Col>
                            { user ? user.username : "" }
                        </Col>
                        <Col className="edit-col">
                            edit
                        </Col>
                    </Row>
                </div>
                <div className="section-container">
                    <h5>Password</h5>
                    <Row>
                        <Col>
                            ************
                        </Col>
                        <Col className="edit-col">
                            edit
                        </Col>
                    </Row>
                </div>
                <div className="section-container">
                    <Row>
                        <Col>
                            <h5>Delete Account</h5>
                        </Col>
                        <Col className="edit-col">
                            <Button className="delete-btn">Delete</Button>
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