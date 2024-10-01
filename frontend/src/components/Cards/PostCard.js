import { Col, Placeholder, Row, NavDropdown } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BsThreeDots } from 'react-icons/bs';
import { handleTimeDifference } from '../../functions/handlers';
import ImageGallery from '../ImageGallery';
import { useDeletePost, useMiddleViewPort } from '../../hooks/hooks';
import { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DeletedCard } from './DeletedCard';
import BlockModal from '../Modals/BlockModal';
import SocialInteractions from '../SocialInteractions';

import "../../assets/styling/PostCard.css";


function PostCard({ post, isAuthenticated }) {
    const [showBlock, setShowBlock] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeletePost(false);

    useEffect(() => {
        if(blocked) {
            window.location.reload();
        }
    }, [blocked])

    function handleMoreClick() {
        return (
            <Fragment>
                { post.is_current_user ? 
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

    if(isDeleted) {
        return <DeletedCard />;
    } else {
        return (
            <>
                <BlockModal show={showBlock} setShow={setShowBlock} setBlocked={setBlocked} username={ post ? post.creator_username : null } />
                <Card>
                    <a href={ 
                        post ? 
                            post.creator_username ? `/${post.creator_username}/${post.id}` : `/deleted/${post.id}`
                    : 
                        "/home" 
                    } 
                        className="post-link"
                    >
                        <Card.Body>
                            <Card.Title>
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
                                            <Col>
                                                { post ? handleTimeDifference(post.posted_date) : <Placeholder xs={4} /> }
                                            </Col>
                                            <Col className="more-col">
                                                <div className="base-btn rounded-btn">
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
                            <SocialInteractions post={ post } />
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