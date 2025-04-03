import { Fragment, useState, useEffect } from 'react';
import { Col, Placeholder, Row, NavDropdown, Card } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { connect } from 'react-redux';

import { DeletedCard } from './DeletedCard';
import ImageGallery from '../ImageGallery';
import BlockModal from '../Modals/BlockModal';
import SocialInteractions from '../UserInteractions/SocialInteractions';
import { handleTimeDifference } from '../../functions/handlers';
import { useDeleteResource, useMiddleViewPort } from '../../hooks/hooks';

import '../../assets/styling/PostCard.css';


function PostCard({ post, isAuthenticated }) {
    const [showBlock, setShowBlock] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeleteResource(false);

    useEffect(() => {
        if(blocked) {
            window.location.reload();
        }
    }, [blocked])

    function handleMoreClick() {
        return (
            <Fragment>
                { post.is_current_user ? 
                    <NavDropdown.Item onClick={() => { setIsDeleted('posts', post.id) }}>
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
                <BlockModal show={showBlock} setShow={setShowBlock} setBlocked={setBlocked} username={ post ? post.article.creator.username : null } />
                <Card>
                    <a href={ 
                        post.article.creator.username ? 
                            post ? `/${post.article.creator.username}/${post.id}` : `/deleted/${post.id}`
                    : 
                        '/' 
                    } 
                        className='obj-link'
                    >
                        <Card.Body>
                            <Card.Title>
                                <Row className='center-row-items'>
                                    <Col>
                                        <div className='creator-container'>
                                            {
                                                post && post.article.creator.username ? 
                                                    <a href={ `/${post.article.creator.username}` }>
                                                        { post.article.creator.username }
                                                    </a>
                                                :
                                                '[Deleted]'
                                            }
                                        </div>
                                    </Col>
                                    <Col className='time-col' id='time-col'>
                                        <Row className='center-row-items'>
                                            <Col>
                                                { post ? handleTimeDifference(post.article.date_created) : <Placeholder xs={4} /> }
                                            </Col>
                                            <Col className='more-col'>
                                                <div className='base-btn rounded-btn'>
                                                    <NavDropdown title={<BsThreeDots />} 
                                                        drop={ aboveMid ? 'up-centered' : 'down-centered' }
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
                            <div className='image-gallery' id='image-gallery'>
                                { post ? <ImageGallery gallery={post.image}/> : <ImageGallery gallery={null} uploaded={false} /> }
                            </div>
                            { post ? 
                                <Card.Text>
                                    { post.content }
                                </Card.Text> : 
                                <Placeholder as={Card.Text} animation='wave'>
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder> 
                            }
                        </Card.Body>
                    </a>
                    <Card.Footer className='no-select'>
                            <SocialInteractions resource={'posts'} obj={ post } />
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