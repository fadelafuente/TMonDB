import { useNavigate } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';
import { useGetProfile } from '../../hooks/hooks';

import "../../assets/styling/PostCard.css";
import "../../assets/styling/UserProfile.css";
import { connect } from 'react-redux';

function FollowCard({ user, isAuthenticated }) {
    const [ , followed, , setFollow] = useGetProfile(user.username);
    const navigate = useNavigate();

    return (
        <>
            <div className="row-gap-container item-card">
                <div className="pfp-image">
                    pfp
                </div>
                <div className="f-user-details">
                    <div className="row-gap-container">
                        <Col className="follow-username">
                            @{user ? user.username : "Anonymous" }
                        </Col>
                        <Col className="align-right">
                            { user.current_user ? 
                                <Button className="base-btn reverse-base-btn" onClick={ () => navigate(`/${user.username}`) }>
                                    Profile
                                </Button>
                                :
                                <Button className="base-btn reverse-base-btn" onClick={ () => { isAuthenticated ? setFollow(user.id) : navigate("/login") } }>
                                    { followed ? "Unfollow" : "Follow" } 
                                </Button>
                            }
                        </Col>
                    </div>
                    <div>
                        {user ? user.bio : "This is a fantastic bio! A little empty though, no?" }
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated});

export default connect(mapStateToProps, null)(FollowCard);