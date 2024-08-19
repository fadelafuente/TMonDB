import { Fragment, React, useEffect, useRef, useState } from 'react';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsChatRightDotsFill, BsHeartFill, BsThreeDots } from 'react-icons/bs';
import { Alert, Button, Card, Col, NavDropdown, Placeholder, Row } from 'react-bootstrap';
import BlockModal from './BlockModal';
import CreatePost from './CreatePost';
import { connect } from 'react-redux';
import { useDeletePost, useMiddleViewPort, useTimedAlert } from '../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { handleTimeDifference } from '../functions/handlers';

import '../assets/styling/MonCard.css';

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
    const desc = useRef();

    useEffect(() => {
        if(!desc?.current) return;

        const resizeObserver = new ResizeObserver(() => {
            const description = document.getElementById("desc-span");
            const computedSize = window.getComputedStyle(description).fontSize;
            const numLines = Math.floor(desc.current.clientHeight / (parseInt(computedSize.substring(0,2)) * 1.4)) - 1;
            description.style.webkitLineClamp = numLines;
            description.style.lineClamp = numLines;
        });

        resizeObserver.observe(desc.current);
        
        return () => resizeObserver.disconnect();
    }, []);

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
                            <Card.Header className="mon-card-header">
                                <Row className="center-row-items">
                                    <Col>
                                        <div className="creator-container">
                                            {
                                                post && post.creator_username ? 
                                                    <a href={ `/${post.creator_username}` }>
                                                        { post.creator_username }
                                                    </a>
                                                :
                                                "[Deleted]"
                                            }
                                        </div>
                                    </Col>
                                    <Col className="time-col" id="time-col">
                                        <Row className="center-row-items">
                                            <Col className="right-padding">
                                                { post ? handleTimeDifference(post.posted_date) : "0s" }
                                            </Col>
                                            <Col className="more-col">
                                                <div className="more-btn">
                                                    <NavDropdown title={<BsThreeDots />} 
                                                        drop={ aboveMid ? "up-centered" : "down-centered" }
                                                        onClick={e => setAboveMid(e)}
                                                        disabled={ !isAuthenticated }
                                                    >
                                                        { handleMoreClick() }
                                                    </NavDropdown>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body className="mon-card-body">
                                <div className="image-aspect-container">
                                    <Row className='image-container'>
                                            
                                    </Row>
                                </div>
                                <Row className='content-text'>
                                    <Row className="mon-info">
                                        <Col className="mon-name">
                                            <h3>Bulbasaur</h3>
                                            <div className='mon-species'>
                                                The Bulb Pokemon
                                            </div>
                                        </Col>
                                        <Col className='typing'>
                                            <Button href='/trending' className='links type1'>GRA</Button>
                                            <Button href='/trending' className='links type2'>POI</Button>
                                        </Col>
                                    </Row>
                                    <div className='description' id='description' ref={desc}>
                                            <span id='desc-span'>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                            </span>
                                    </div>
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
                                        className="svg-dropdown"
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