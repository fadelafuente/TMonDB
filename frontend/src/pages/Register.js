import { register, registerAttempt } from '../actions/auth';
import { React } from "react";
import { InputGroup, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { useNavigateOnAuth, useRequestAttempt, useRegisterAttempt, useFormData, usePassword } from '../hooks/hooks';

import '../assets/styling/forms.css';

function Register({ register, isAuthenticated, errMessage, registerAttempt, accountCreated }) {
    const [showPass, setShowPass] = usePassword(false);
    const [showPassRe, setShowPassRe] = usePassword(false);
    const [formData, setFormData] = useFormData({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        re_password: ''
    });

    const { first_name, last_name, username, email, password, re_password } = formData;

    useNavigateOnAuth(isAuthenticated);
    const [show, setShow, message] = useRegisterAttempt(errMessage, isAuthenticated, registerAttempt);
    useRequestAttempt(accountCreated, errMessage, email, registerAttempt);

    function onSubmit(e) {
        e.preventDefault();

        if(password === re_password) {
            register(first_name, last_name, username, email, password, re_password);
        }  
    }

    return (
        <div className="form-container">
            <Modal
                backdrop="static"
                keyboard={ false }
                show={ show }
                onHide={ () => setShow() }
                id="error-modal"
            >
                <Modal.Header closeButton closeVariant="white">
                <Modal.Title>Invalid Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { message ? <p>{ message }</p> : <p>Either the email or password is incorrect.</p> }
                </Modal.Body>
            </Modal>
            <h2 className="form-title">Create a New Account</h2>
            <Form className="Form" onSubmit={ e => onSubmit(e) }>
                <Form.Group className="form-group">
                    <Form.Control 
                        type="text" 
                        placeholder="First Name*" 
                        name="first_name"
                        value={ first_name }
                        onChange={ e => setFormData(e) }
                    />
                </Form.Group>
                <Form.Group className="form-group">
                    <Form.Control 
                        type="text" 
                        placeholder="Last Name*" 
                        name="last_name"
                        value={ last_name }
                        onChange={ e => setFormData(e) }
                    />
                </Form.Group>
                <Form.Group className="form-group">
                    <Form.Control 
                        type="text" 
                        placeholder="Username*" 
                        name="username"
                        value={ username }
                        onChange={ e => setFormData(e) }
                    />
                </Form.Group>
                <Form.Group controlId="formBasicEmail" className="form-group">
                    <Form.Control 
                        type="email" 
                        placeholder="Email*" 
                        name="email"
                        value={ email }
                        onChange={ e => setFormData(e) }
                        required
                    />
                    <Form.Text>
                        We will never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="password-input" className="form-group">
                    <Form.Text>Your password must have: <br/></Form.Text>
                    <Form.Text id="lowercase" className="invalid">at least 1 lowercase letter <br/></Form.Text>
                    <Form.Text id="uppercase" className="invalid">at least 1 uppercase letter <br/></Form.Text>
                    <Form.Text id="number" className="invalid">at least 1 number <br/></Form.Text>
                    <Form.Text id="special" className="invalid">at least one special character <br/></Form.Text>
                    <Form.Text id="length" className="invalid">between 8-20 characters <br/></Form.Text>
                    <InputGroup>
                        <Form.Control
                            type="password" 
                            placeholder="Password*" 
                            name="password"
                            value={ password }
                            onChange={ e => setFormData(e) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => setShowPass("password-input") }
                            id="password-toggle"
                        >
                            { showPass ? <BsEyeFill /> : <BsEyeSlash /> }
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="re-password-input" className="form-group">
                    <InputGroup>
                        <Form.Control 
                            type="password" 
                            placeholder="Repeat Password*" 
                            name="re_password"
                            value={ re_password }
                            onChange={ e => setFormData(e) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => setShowPassRe("re-password-input") }
                            id="password-toggle"
                        >
                            { showPassRe ? <BsEyeFill /> : <BsEyeSlash /> }
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <Form.Text>
                    Already have an account? <Link to="/login">Login here</Link>
                </Form.Text>
            </Form>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errMessage: state.auth.errMessage,
    accountCreated: state.auth.accountCreated
});

export default connect(mapStateToProps, { register, registerAttempt: registerAttempt })(Register);