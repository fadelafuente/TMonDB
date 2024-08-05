import { Fragment, React, useState } from 'react';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsChatRightDotsFill, BsHeartFill } from 'react-icons/bs';

import '../assets/styling/MonCard.css';
import { Alert, Button, Card, Col, NavDropdown, Row } from 'react-bootstrap';
import BlockModal from './BlockModal';
import CreatePost from './CreatePost';
import { connect } from 'react-redux';
import { useDeletePost, useMiddleViewPort, useTimedAlert } from '../hooks/hooks';
import { useNavigate } from 'react-router-dom';

function MonCard({post=null, isAuthenticated}) {
    // const [liked, likes, setLike] = useInteractions(post.likes_count, post.user_liked);
    // const [reposted, reposts, setRepost] = useInteractions(post.reposts_count, post.user_reposted);
    // const [commented, comments] = useInteractions(post.comments_count, post.user_commented);

    const [likes, setLike] = useState(0);
    const [liked, setLiked] = useState(false);
    const [reposts, setRepost] = useState(0);
    const [reposted, setReposted] = useState(0);
    const [comments, setComment] = useState(0);
    const [commented, setCommented] = useState(0);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [showAlert, setShowAlert] = useTimedAlert(false);
    const [show, setShow] = useState(false);
    const [showBlock, setShowBlock] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [isDeleted, setIsDeleted] = useDeletePost(false);
    const navigate = useNavigate();

    function handleCopyLink(path) {
        navigator.clipboard.writeText(`${process.env.REACT_APP_WEB_URL}/${path}`);
        setShowAlert(true);
    }

    function handleMoreClick() {
        return (
            <Fragment>
                { post && post.is_current_user ? 
                    <NavDropdown.Item onClick={() => { setIsDeleted(post.id) }}>
                        Delete Post
                    </NavDropdown.Item>
                : 
                    <NavDropdown.Item onClick={() => setShowBlock(true) }>
                        Block user
                    </NavDropdown.Item>
                }
            </Fragment>
        )
    }

    return (
        <>
            <BlockModal show={showBlock} setShow={setShowBlock} setBlocked={setBlocked} username={ post ? post.creator_username : null } />
            <CreatePost show={show} setShow={() => setShow()} is_reply={true} parent={ post ? post.id : null } />
            <Alert variant="success" className="copy-alert" show={showAlert}>
                <Alert.Heading>Copied to clipboard.</Alert.Heading>
            </Alert>
            <div className="article-container">
                <div className='card-background-aspect'>
                    <div className="aspect-border">
                        <Card className='aspect-inner'>
                            <Card.Header>
                                <Row className='name-and-time'>
                                    <Col className='left-col'>
                                        <h3>@Johnathie</h3>
                                    </Col>
                                    <Col className='right-col'>
                                        <h3> 22hrs ago</h3>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Row className='image-container'>
                            
                                </Row>
                                <Row className='content-text'>
                                    <h3>Bulbasaur</h3>
                                    <div className='mon-species'>
                                        The Bulb Pokemon
                                    </div>
                                    <hr className='content-separator' />
                                    <div className='typing'>
                                        <Button href='/trending' className='links type1'>grass</Button>
                                        &emsp;
                                        <Button href='/trending' className='links type2'>poison</Button>
                                    </div>
                                    
                                    <hr className='content-separator' />
                                    <div className='description'>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </div>
                                    <hr className='content-separator' />
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                            <Row className="interactions-row">
                                <Col className='interaction-btn left-btn'>
                                    <button className="svg-btn" onClick={
                                        isAuthenticated ? 
                                            (commented ? () => {} : () => setShow(true)) 
                                        : () => navigate("/login") 
                                    }>
                                        <Row className="inner-btn-div">
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
                                <Col className='interaction-btn'>
                                    <button className="svg-btn" name="repost" onClick={ 
                                        isAuthenticated && post ? e => setRepost(e, post.id) : () => navigate("/login")
                                    }>
                                        <Row className="inner-btn-div">
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
                                <Col className='interaction-btn'>
                                    <button className="svg-btn" name="like" onClick={
                                        isAuthenticated && post ? e => setLike(e, post.id) : () => navigate("/login")
                                    }>
                                        <Row className="inner-btn-div">
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
                                <Col className='interaction-btn share-btn'>
                                    <NavDropdown title={<BsShare/>} 
                                        drop={ aboveMid ? "up-centered" : "down-centered" }
                                        onClick={e => setAboveMid(e)}
                                    >
                                        <NavDropdown.Item onClick={() => handleCopyLink("")}>
                                            Copy link
                                        </NavDropdown.Item>
                                        { isAuthenticated ? handleMoreClick : "" }
                                    </NavDropdown>
                                </Col>
                            </Row>
                            </Card.Footer>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(MonCard);