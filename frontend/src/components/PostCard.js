import { Col, Placeholder, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsEye } from 'react-icons/bs';
import { handleTimeDifference } from '../functions/handlers';

import "../assets/styling/PostCard.css";

function PostCard({ post }) {
    console.log(post);

    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <Placeholder as={Card.Text} animation="wave">
                        <Row>
                            <Col>
                                <Placeholder xs={8} />
                            </Col>
                            <Col className="time-col" id="time-col">
                                { handleTimeDifference(post.posted_date) }
                            </Col>
                        </Row>
                    </Placeholder>
                </Card.Title>
                <div className="image-gallery" id="image-gallery">
                </div>
                <Card.Text>
                    { post.content }
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Row className="interactions-row">
                    <Col className='interaction-btn left-btn'>
                        <button>
                            <Row className="inner-btn-div">
                                <Col className='interaction-icon'>
                                    <BsChatRightDots />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        { post.comments_count }
                                    </span>
                                </Col>
                            </Row>
                        </button>
                    </Col>
                    <Col className='interaction-btn inner-btn'>
                        <button>
                            <Row className="inner-btn-div">
                                <Col className='interaction-icon'>
                                    <BsRepeat />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        { post.reposts_count }
                                    </span>
                                </Col>
                            </Row>
                        </button>
                    </Col>
                    <Col className='interaction-btn inner-btn'>
                        <button>
                            <Row className="inner-btn-div">
                                <Col className='interaction-icon'>
                                    <BsHeart />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        { post.likes_count }
                                    </span>
                                </Col>
                            </Row>
                        </button>
                    </Col>
                    <Col className='interaction-btn inner-btn'>
                        <button>
                            <Row className="inner-btn-div">
                                <Col className='interaction-icon'>
                                    <BsEye />
                                </Col>
                                <Col className='interaction-nums'>
                                    <span>
                                        0
                                    </span>
                                </Col>
                            </Row>
                        </button>
                    </Col>
                    <Col className='interaction-btn right-btn share-btn'>
                        <button>
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