import { Col, Row, Dropdown, Alert, DropdownButton } from 'react-bootstrap';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsHeartFill, BsChatRightDotsFill } from 'react-icons/bs';
import { useInteractions } from '../../hooks/articles/use-interactions';
import { useMiddleViewPort } from '../../hooks/misc/use-middle-viewport';
import { useTimedAlert } from '../../hooks/misc/use-timed-alert';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../Creates/CreatePost';
import { useState } from 'react';

import '../../assets/styling/PostCard.css';

function SocialInteractions({ resource=null, obj=null, isAuthenticated }) {
    const [liked, likes, setLike] = useInteractions(obj ? obj.likes_count : 0, obj ? obj.user_liked : 0);
    const [reposted, reposts, setRepost] = useInteractions(obj ? obj.reposts_count : 0, obj ? obj.user_reposted : 0);
    const [commented, comments] = useInteractions(obj ? obj.comments_count : 0, obj ? obj.user_commented : 0);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [showAlert, setShowAlert] = useTimedAlert(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    function handleCopyLink(path) {
        navigator.clipboard.writeText(`${process.env.REACT_APP_WEB_URL}/${path}`);
        setShowAlert(true);
    }

    return (
        <>
            <CreatePost show={show} setShow={obj ? () => setShow() : () => {}} parent={obj ? obj.article.id : null} />
            <Alert variant='success' className='copy-alert' show={showAlert}>
                <Alert.Heading>Copied to clipboard.</Alert.Heading>
            </Alert>
            <Row className='interactions-row'>
                <Col>
                    <button className='svg-btn' onClick={
                        isAuthenticated ? 
                            obj ?
                                commented ? () => {} : () => setShow(true)
                            :
                                () => {}
                        : () => navigate('/login') 
                    }>
                        <Row>
                            <Col className={commented ? 'interaction-icon interacted' : 'interaction-icon'}>
                                { commented ? <BsChatRightDotsFill /> : <BsChatRightDots /> }
                            </Col>
                            <Col className='interaction-nums'>
                                <span>
                                    { comments }
                                </span>
                            </Col>
                        </Row>
                    </button>
                </Col>
                <Col>
                    <button className='svg-btn' name='repost' onClick={ 
                        isAuthenticated ? 
                            obj ?
                                e => setRepost(e, resource, obj.id) 
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
                                e => setLike(e, resource, obj.id) 
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
                        <Dropdown.Item onClick={() => handleCopyLink(
                            obj ? 
                                obj.article.creator.username ? 
                                    `${obj.article.creator.username}/${obj.id}` 
                                : 
                                    `deleted/${obj.id}` 
                            : 
                                'home'
                        )}>
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