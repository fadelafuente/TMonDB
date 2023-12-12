import { reset_password_confirm } from "../actions/auth";
import { handleShowPass, handleChange, handleChangeAndValidation } from "../functions/handlers";
import React, { useState } from "react";
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BsEyeSlash, BsEyeFill } from 'react-icons/bs';
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function ResetPasswordConfirm({ reset_password_confirm }) {
    const navigate = useNavigate();
    const { uid, token } = useParams();
    const [requestSent, setRequestSent] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showPassRe, setShowPassRe] = useState(false);
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    useEffect(() => {
        if(requestSent) {
            return navigate("/trending");
        }
        // eslint-disable-next-line
    }, [requestSent]);

    function onSubmit(e) {
        e.preventDefault();

        reset_password_confirm(uid, token, new_password, re_new_password);
        setRequestSent(true);
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Enter New Password</h2>
            <Form className="form" onSubmit={ e=> onSubmit(e) }>
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
                            placeholder="New Password" 
                            name="new_password"
                            value={ new_password }
                            onChange={ e => handleChangeAndValidation(e, setFormData, formData) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass("#password-input", setShowPass, showPass) }
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
                            placeholder="Confirm New Password" 
                            name="re_new_password"
                            value={ re_new_password }
                            onChange={ e => handleChange(e, setFormData, formData) }
                            required
                        />
                        <InputGroup.Text 
                            onClick={ () => handleShowPass("#re-password-input", setShowPassRe, showPassRe) }
                            id="password-toggle"
                        >
                            { showPassRe ? <BsEyeFill /> : <BsEyeSlash /> }
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Reset Password
                </Button>
            </Form>
        </div>
    )
}

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);