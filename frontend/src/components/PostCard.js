import { Col, Placeholder, Row, NavDropdown } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsHeartFill, BsChatRightDotsFill, BsThreeDots } from 'react-icons/bs';
import { handleTimeDifference } from '../functions/handlers';
import ImageGallery from './ImageGallery';
import { useDeletePost, useInteractions, useMiddleViewPort } from '../hooks/hooks';
import { Fragment, useState } from 'react';
import CreatePost from './CreatePost';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CopyAlert } from './CopyAlert';

import "../assets/styling/PostCard.css";
import { DeletedCard } from './DeletedCard';

function PostCard({ post, isAuthenticated }) {
    const [liked, likes, setLike] = useInteractions(post.likes_count, post.user_liked);
    const [reposted, reposts, setRepost] = useInteractions(post.reposts_count, post.user_reposted);
    const [commented, comments] = useInteractions(post.comments_count, post.user_commented);
    const [show, setShow] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [showAlert, setShowAlert] = useState(false);
    const [isDeleted, setIsDeleted] = useDeletePost(false);
    const navigate = useNavigate();

    function handleMoreClick() {
        return (
            <Fragment>
                <NavDropdown.Item onClick={() => {}}>
                    Block user
                </NavDropdown.Item>
                { post.is_current_user ? 
                    <NavDropdown.Item onClick={() => { setIsDeleted(post.id) }}>
                        Delete Post
                    </NavDropdown.Item>
                : "" }
            </Fragment>
        )
    }

    function handleCopyLink(path) {
        navigator.clipboard.writeText(`${process.env.REACT_APP_WEB_URL}/${path}`);
        setShowAlert(true);
    }

    if(isDeleted) {
        return <DeletedCard />;
    } else {
        return (
            <>
                <CreatePost show={show} setShow={() => setShow()} is_reply={true} parent={post.id} />
                { showAlert ? <CopyAlert showAlert={showAlert} setShowAlert={() => setShowAlert()} /> : "" }
                <Card>
                    <a href={ post ? `/${post.creator_username}/${post.id}` : "/home" } 
                        className="post-link"
                    >
                        <Card.Body>
                            <Card.Title>
                                <Row>
                                    <Col>
                                        { post ? post.creator_username : <Placeholder xs={8} /> }
                                    </Col>
                                    <Col className="time-col" id="time-col">
                                        <Row>
                                            <Col>
                                                { post ? handleTimeDifference(post.posted_date) : <Placeholder xs={4} /> }
                                            </Col>
                                            <Col className="more-btn">
                                                <NavDropdown title={<BsThreeDots/>} 
                                                    drop={ aboveMid ? "up-centered" : "down-centered" }
                                                    onClick={e => setAboveMid(e)}
                                                    disabled={ !isAuthenticated }
                                                >
                                                    { handleMoreClick() }
                                                </NavDropdown>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Title>
                            <div className="image-gallery" id="image-gallery">
                                { post ? <ImageGallery gallery={post.image}/> : <ImageGallery gallery={null} uploaded={false} /> }
                            </div>
                            { post ? 
                                <Card.Text>
                                    { post.content }
                                </Card.Text> : 
                                <Placeholder as={Card.Text} animation="wave">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder> 
                            }
                        </Card.Body>
                    </a>
                    <Card.Footer className="no-select">
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
                                <button className="svg-btn" name="set_repost" onClick={ 
                                    isAuthenticated ? e => setRepost(e, post.id, isAuthenticated) : () => navigate("/login")
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
                                <button className="svg-btn" name="set_like" onClick={
                                    isAuthenticated? e => setLike(e, post.id, isAuthenticated) : () => navigate("/login")
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
                                    <NavDropdown.Item onClick={() => handleCopyLink(`${post.creator_username}/${post.id}`)}>
                                        Copy link
                                    </NavDropdown.Item>
                                    { isAuthenticated ? handleMoreClick : "" }
                                </NavDropdown>
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            </>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(PostCard);