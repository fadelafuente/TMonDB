import { Col, Placeholder, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots } from 'react-icons/bs';
import { handleTimeDifference } from '../functions/handlers';
import ImageGallery from './ImageGallery';

import "../assets/styling/PostCard.css";

function PostCard({ post }) {
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
                        <button className="svg-btn">
                            <Row className="inner-btn-div">
                                <Col className='interaction-icon'>
                                    <BsRepeat />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        { post ? post.reposts_count : 0 }
                                    </span>
                                </Col>
                            </Row>
                        </button>
                    </Col>
                    <Col className='interaction-btn'>
                        <button className="svg-btn">
                            <Row className="inner-btn-div">
                                <Col className='interaction-icon'>
                                    <BsHeart />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        { post ? post.likes_count : 0 }
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