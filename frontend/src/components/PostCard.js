import { Col, Placeholder, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsHeartFill } from 'react-icons/bs';
import { handleTimeDifference } from '../functions/handlers';
import ImageGallery from './ImageGallery';

import "../assets/styling/PostCard.css";
import { useInteractions } from '../hooks/hooks';

function PostCard({ post }) {
    const [liked, likes, setLike] = useInteractions(post.likes_count, post.user_liked);
    const [reposted, reposts, setRepost] = useInteractions(post.likes_count, false);

    return (
        <Card>
            <a href={post ? `/${post.creator_username}/${post.id}` : "/home" } className="post-link">
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col>
                                { post ? post.creator_username : <Placeholder xs={8} /> }
                            </Col>
                            <Col className="time-col" id="time-col">
                                { post ? handleTimeDifference(post.posted_date) : <Placeholder xs={4} /> }
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
                        <button className="svg-btn">
                            <Row className="inner-btn-div">
                                <Col className='interaction-icon'>
                                    <BsChatRightDots />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        { post ? post.comments_count : 0 }
                                    </span>
                                </Col>
                            </Row>
                        </button>
                    </Col>
                    <Col className='interaction-btn'>
                        <button className="svg-btn" name="reposts_count" onClick={e => setRepost(e, post.id)}>
                            <Row className="inner-btn-div">
                                <Col className={reposted ? 'interaction-icon interacted' : 'interaction-icon'}>
                                    <BsRepeat />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        { post ? reposts : 0 }
                                    </span>
                                </Col>
                            </Row>
                        </button>
                    </Col>
                    <Col className='interaction-btn'>
                        <button className="svg-btn" name="likes_count" onClick={e => setLike(e, post.id) }>
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
                        <button className="svg-btn">
                            <div className='interaction-icon'>
                                <BsShare />
                            </div>
                        </button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}

export default PostCard;