import { Button, InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { BsReply } from 'react-icons/bs';
import { useCreatePost } from '../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import "../assets/styling/content.css";
import "../assets/styling/ViewPost.css"

function ReplyBar({isAuthenticated, parent}) {
    const initialForm = {
        content: ''
    };
    const [formData, resetFormData, setFormData] = useCreatePost(initialForm);
    const navigate = useNavigate();

    const { content } = formData;

    return (
        <Form className="reply-form" onSubmit={ isAuthenticated ? e => setFormData(e, content, true, parent) : () => {navigate("/login")} }>
            <InputGroup>
                <InputGroup.Text>
                        <BsReply />
                </InputGroup.Text>
                <Form.Control 
                    type="text" 
                    className="reply" 
                    placeholder="Post your reply" 
                    name="content"
                    value= { content }
                    onChange={ e => { resetFormData(e) } }
                />
                <InputGroup.Text 
                    className="submit-reply"
                >
                    <Button 
                        className="reply-btn"
                        variant='primary'
                        type='submit'
                    >
                        Reply
                    </Button>
                </InputGroup.Text>
            </InputGroup>   
        </Form>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ReplyBar);