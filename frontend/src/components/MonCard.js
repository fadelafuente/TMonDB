import { React } from 'react';
import { BsShare, BsHeart, BsRepeat, BsChatRightDots, BsEye } from 'react-icons/bs';

import '../assets/styling/MonCard.css';
import { Button, Col, Row } from 'react-bootstrap';

export default function MonCard() {
    return (
        <div className='card-background'>
            <div className='card-inner'>
                <Row className='name-and-time'>
                    <Col className='left-col'>
                        <h3>JohnDoe@Johnathie</h3>
                    </Col>
                    <Col className='right-col'>
                        <h3> 22hrs ago</h3>
                    </Col>
                </Row>
                <Row className='image-container'>
                    <img src={ require('../assets/images/hehehe.jpg') } />
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
                <span className='content-interactions'>
                    <div className='interaction-btn left-btn'>
                        <button>
                            <div className='inner-div'>
                                <div className='interaction-icon'>
                                    <BsChatRightDots />
                                </div>
                                <div className='interaction-nums'>
                                    <span>
                                        999k
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className='interaction-btn inner-btn'>
                        <button>
                            <div className='inner-div'>
                                <div className='interaction-icon'>
                                    <BsRepeat />
                                </div>
                                <div className='interaction-nums'>
                                    <span>
                                        999k
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                    <hr />
                    <div className='interaction-btn inner-btn'>
                        <button>
                            <div className='inner-div'>
                                <div className='interaction-icon'>
                                    <BsHeart />
                                </div>
                                <div className='interaction-nums'>
                                    <span>
                                        999k
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className='interaction-btn inner-btn'>
                        <button>
                            <div className='inner-div'>
                                <div className='interaction-icon'>
                                    <BsEye />
                                </div>
                                <div className='interaction-nums'>
                                    <span>
                                        999k
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div className='interaction-btn right-btn share-btn'>
                        <button>
                            <div className='inner-div'>
                                <div className='interaction-nums'>
                                </div>
                                <div className='interaction-icon'>
                                    <BsShare />
                                </div>
                            </div>
                        </button>
                    </div>
                </span>
            </div>
        </div>
    )
}