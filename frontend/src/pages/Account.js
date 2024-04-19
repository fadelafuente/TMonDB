import { React } from "react";

import '../assets/styling/forms.css';
import '../assets/styling/Account.css';
import { Button, Col, Row } from "react-bootstrap";

export default function Account() {
    return (
        <>
            <div className="profile-info-container">
                <h3>My Account</h3>
                <div className="section-container">
                    <h5>Email</h5>
                    <Row>
                        <Col>
                            placeholder@placeholder.com
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
                            placeholderUser
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