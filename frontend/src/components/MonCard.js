import { React } from 'react';
import { BsPlusCircle, BsPersonCircle, BsSearch } from 'react-icons/bs';

import '../assets/styling/MonCard.css';
import { Col, Row } from 'react-bootstrap';

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
                    <h3>Bulbasaur | The Bulb Pokemon</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </Row>
            </div>
        </div>
    )
}