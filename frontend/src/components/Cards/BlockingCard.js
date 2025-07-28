import { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import BlockModal, { UnBlockModal } from '../Modals/BlockModal';

import '../../assets/styling/PostCard.css';

export default function BlockingCard({ user }) {
    const [blocked, setBlocked] = useState(true);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {
                blocked ? 
                    <UnBlockModal show={show} setShow={setShow} setBlocked={setBlocked} username={user.username} />
                :
                    <BlockModal show={show} setShow={setShow} setBlocked={setBlocked} username={user.username} />
            }
            <div className='article-container item-card'>
                <div className='row-gap-container'>
                    <Col className='follow-username'>
                        <button 
                            className='svg-btn' 
                            onClick={ user ? () => navigate(`/${user.username}`) : () => {} }
                        >
                            @{user ? user.username : 'Anonymous' }
                        </button>
                    </Col>
                    <Col className='align-right'>
                        <Button 
                            className='base-btn reverse-base-btn right-most-btn' 
                            onClick={ user ? () => setShow(true) : () => navigate('/login') }
                        >
                            { blocked ? 'unblock' : 'block' } 
                        </Button>
                    </Col>
                </div>
            </div>
        </>
    )
}