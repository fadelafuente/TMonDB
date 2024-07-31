import { Button, Col } from 'react-bootstrap';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import BlockModal, { UnBlockModal } from './BlockModal';

import "../assets/styling/PostCard.css";

function BlockingCard({ user, isAuthenticated }) {
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
            <div className="article-container item-card">
                <div className="align-row f-user-row">
                    <Col className="follow-username">
                        <button 
                            className="svg-btn" 
                            onClick={ user ? () => navigate(`/${user.username}`) : () => {} }
                        >
                            @{user ? user.username : "Anonymous" }
                        </button>
                    </Col>
                    <Col className="align-right">
                        <Button 
                            className="rounded-btn profile-btn right-most-btn" 
                            onClick={ isAuthenticated && user ? () => setShow(true) : () => navigate("/login") }
                        >
                            { blocked ? "unblock" : "block" } 
                        </Button>
                    </Col>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated});

export default connect(mapStateToProps, null)(BlockingCard);