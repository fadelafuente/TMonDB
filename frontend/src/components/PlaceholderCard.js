import { Col, Placeholder, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsEye } from 'react-icons/bs';
import Carousel from 'react-bootstrap/Carousel';

import "../assets/styling/PostCard.css";

function PlaceholderCard() {
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
                                <Placeholder xs={4} />
                            </Col>
                        </Row>
                    </Placeholder>
                </Card.Title>
                <div className="image-gallery">
                    <Carousel interval={null}>
                        <Carousel.Item>
                            <img src={ 'https://placehold.co/600x400' } />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={ 'https://placehold.co/600x400' } />
                        </Carousel.Item>
                    </Carousel>
                </div>
                <Card.Text>
                    <Placeholder as={Card.Text} animation="wave">
                        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                        <Placeholder xs={6} /> <Placeholder xs={8} />
                    </Placeholder>
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
                                        0
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
                                        0
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
                                        0
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

export default PlaceholderCard;