import { Button, Col } from 'react-bootstrap';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { patchCurrentUsersBlockedList } from "../actions/auth";
import { useState } from "react";

import "../assets/styling/PostCard.css";

function BlockingCard({ user, isAuthenticated }) {
    const [blocked, setBlocked] = useState(true);
    const navigate = useNavigate();

    return (
        <div className="article-container">
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
                    { user ? 
                        <Button 
                            className="rounded-btn profile-btn" 
                            onClick={ isAuthenticated ? () => { patchCurrentUsersBlockedList(user.username); setBlocked((prev) => !prev); } : () => navigate("/login") }
                        >
                            { blocked ? "unblock" : "block" } 
                        </Button>
                        :
                        ""
                    }
                </Col>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated});

export default connect(mapStateToProps, null)(BlockingCard);