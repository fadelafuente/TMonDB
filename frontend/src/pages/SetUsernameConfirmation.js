import React from 'react';
import { FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Form, useLocation, useNavigate } from 'react-router-dom';

export function SetUsernameConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="form-container">
            <h2 className="form-title">Welcome {location.state.username}! </h2>
            <Form className="form">
                <FormText>
                    Your username has successfully been changed, click on the button below to return to the homepage.
                </FormText>
                <Button 
                    variant="primary" 
                    type="submit"
                    onClick={ () => navigate("/home") }
                >
                    return to homepage
                </Button>
            </Form>
        </div>
    );
};
