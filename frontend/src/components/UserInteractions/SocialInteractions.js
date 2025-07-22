import { Col, Row, Dropdown, Alert, DropdownButton } from 'react-bootstrap';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsHeartFill, BsChatRightDotsFill } from 'react-icons/bs';
import { useInteractions } from '../../hooks/articles/use-interactions';
import { useMiddleViewPort } from '../../hooks/misc/use-middle-viewport';
import { useCreateResource } from '../../hooks/api/use-create-resource';
import { useTimedAlert } from '../../hooks/misc/use-timed-alert';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from '../Modals/CreatePostModal';
import { useState } from 'react';

import '../../assets/styling/PostCard.css';

function SocialInteractions({ resource=null, obj=null, isAuthenticated }) {
  const initialData = { 
    id: obj ? obj.id : null, 
    likes_count: obj ? obj.likes_count : 0, 
    reposts_count: obj ? obj.reposts_count : 0, 
    comments_count: obj ? obj.comments_count : 0, 
    is_current_user: obj ? obj.is_current_user : false, 
    user_liked: obj ? obj.user_liked : false, 
    user_reposted: obj ? obj.user_reposted : false, 
    user_commented: obj ? obj.user_commented : false
  };
  const [liked, likes, setLike] = useInteractions(initialData.likes_count, initialData.user_liked, resource);
  const [reposted, reposts, setRepost] = useInteractions(initialData.reposts_count, initialData.user_reposted, resource);
  const [aboveMid, setAboveMid] = useMiddleViewPort();
  const [showAlert, setShowAlert] = useTimedAlert(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const initialForm = {
    content: ''
  };

  const form = useCreateResource(initialForm);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setShowAlert(true);
  }

  return (
    <>
      <CreatePostModal show={ show } setShow={ obj ? () => setShow() : () => {} } parent={ obj ? obj.article.id : null } form={ form } />
      <Alert variant='success' className='copy-alert' show={showAlert}>
        <Alert.Heading>Copied to clipboard.</Alert.Heading>
      </Alert>
      <Row className='interactions-row'>
        <Col>
          <button className='svg-btn' onClick={
            isAuthenticated ?
              obj ?
                initialData.user_commented ? () => {} : () => setShow(true)
              :
                () => {}
            : () => navigate('/login')
          }>
            <Row>
              <Col className={initialData.user_commented ? 'interaction-icon interacted' : 'interaction-icon'}>
                { initialData.user_commented ? <BsChatRightDotsFill /> : <BsChatRightDots /> }
              </Col>
              <Col className='interaction-nums'>
                <span>
                  { initialData.comments_count }
                </span>
              </Col>
            </Row>
          </button>
        </Col>
        <Col>
          <button className='svg-btn' name='repost' onClick={
            isAuthenticated ?
              obj ?
                e => setRepost(e, obj.id)
              :
                () => {}
            :
              () => navigate('/login')
          }>
            <Row>
              <Col className={reposted ? 'interaction-icon interacted' : 'interaction-icon'}>
                <BsRepeat />
              </Col>
              <Col className='interaction-nums'>
                <span>
                  { reposts }
                </span>
              </Col>
            </Row>
          </button>
        </Col>
        <Col>
          <button className='svg-btn' name='like' onClick={
            isAuthenticated ?
              obj ?
                e => setLike( e, obj.id)
              :
                () => {}
            :
              () => navigate('/login')
          }>
            <Row>
              <Col className={liked ? 'interaction-icon interacted' : 'interaction-icon'}>
                { liked ? <BsHeartFill /> : <BsHeart /> }
              </Col>
              <Col className='interaction-nums'>
                <span>
                  { likes }
                </span>
              </Col>
            </Row>
          </button>
        </Col>
        <Col className='share-btn'>
          <DropdownButton title={<BsShare/>}
            drop={ aboveMid ? 'up-centered' : 'down-centered' }
            onClick={e => setAboveMid(e)}
            className='svg-dropdown'
          >
            <Dropdown.Item onClick={ () => handleCopyLink() }>
              Copy link
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(SocialInteractions);