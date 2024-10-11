import { Col, Row, NavDropdown, Alert } from 'react-bootstrap';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsHeartFill, BsChatRightDotsFill } from 'react-icons/bs';
import { useInteractions, useMiddleViewPort, useTimedAlert } from '../hooks/hooks';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatePost from './Creates/CreatePost';
import { useState } from 'react';

import "../assets/styling/PostCard.css";

function SocialInteractions({ post=null, isAuthenticated }) {
    const [liked, likes, setLike] = useInteractions(post ? post.likes_count : 0, post ? post.user_liked : 0);
    const [reposted, reposts, setRepost] = useInteractions(post ? post.reposts_count : 0, post ? post.user_reposted : 0);
    const [commented, comments] = useInteractions(post ? post.comments_count : 0, post ? post.user_commented : 0);
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
            <CreatePost show={show} setShow={post ? () => setShow() : () => {}} is_reply={true} parent={post ? post.id : null} />
            <Alert variant="success" className="copy-alert" show={showAlert}>
                <Alert.Heading>Copied to clipboard.</Alert.Heading>
            </Alert>
            <Row className="interactions-row">
                <Col>
                    <button className="svg-btn" onClick={
                        isAuthenticated ? 
                            post ?
                                commented ? () => {} : () => setShow(true)
                            :
                                () => {}
                        : () => navigate("/login") 
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
                    <button className="svg-btn" name="repost" onClick={ 
                        isAuthenticated ? 
                            post ?
                                e => setRepost(e, post.id) 
                            :
                                () => {}
                        : 
                            () => navigate("/login")
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
                    <button className="svg-btn" name="like" onClick={
                        isAuthenticated ? 
                            post ?
                                e => setLike(e, post.id) 
                            :
                                () => {}
                        : 
                            () => navigate("/login")
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
                    <NavDropdown title={<BsShare/>} 
                        drop={ aboveMid ? "up-centered" : "down-centered" }
                        onClick={e => setAboveMid(e)}
                        className="svg-dropdown"
                    >
                        <NavDropdown.Item onClick={() => handleCopyLink(
                            post ? 
                                post.creator_username ? 
                                    `${post.creator_username}/${post.id}` 
                                : 
                                    `deleted/${post.id}` 
                            : 
                                "home"
                        )}>
                            Copy link
                        </NavDropdown.Item>
                    </NavDropdown>
                </Col>
            </Row>
        </>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(SocialInteractions);