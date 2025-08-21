import { Button, InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { BsReply } from 'react-icons/bs';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useCreateResource } from '../../hooks/features/api/use-create-resource';

import '../../assets/styling/content.css';
import '../../assets/styling/ViewPost.css'

export default function ReplyBar({ parent }) {
  const initialForm = {
    content: ''
  };
  const { isAuthenticated } = useOutletContext();
  const [formData, resetFormData, setFormData] = useCreateResource(initialForm);
  const navigate = useNavigate();

  const { content } = formData;

  return (
    <Form className='reply-form' onSubmit={ isAuthenticated ? e => setFormData(e, { content, parent }) : () => {navigate('/login')} }>
      <InputGroup>
        <InputGroup.Text>
          <BsReply />
        </InputGroup.Text>
        <Form.Control
          type='text'
          className='reply'
          placeholder='Post your reply'
          name='content'
          value= { content }
          onChange={ e => { resetFormData(e) } }
        />
        <InputGroup.Text
          className='submit-reply'
        >
          <Button
            className='reply-btn'
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