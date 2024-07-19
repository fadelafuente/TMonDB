import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Tab, Tabs, NavDropdown } from 'react-bootstrap';
import { useGetProfile, useMiddleViewPort } from '../hooks/hooks';
import { BsThreeDots } from 'react-icons/bs';
import PostArticle from './PostArticle';
import EditModal from './EditModal';
import { useState } from 'react';
import { connect } from 'react-redux';
import { BlockedCard } from './BlockedCard';

import "../assets/styling/PostCard.css";
import "../assets/styling/UserProfile.css";

function ProfileInfo({isAuthenticated}) {
    const { creator } = useParams();
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [profile, followed, follows, setFollow] = useGetProfile(creator);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <EditModal show={show} setShow={() => setShow() } />
            <div className="banner-container">
            </div>
            <div className="profile-info-container">
                <div className="about-user-container">
                    <div className="user-row">
                        <div className="pfp-outer-container">
                            <div className="pfp-container">
                            </div>
                        </div>
                        <div className="username-container">
                            @{ profile ? profile.username : creator }
                        </div>
                    </div>
                    <div className="align-row">
                        <div className="following follow">
                            <button className="post-link text-link" onClick={() => navigate(`follow`, {state: {initial_type: "following"}})}>
                                { profile ? profile.following_count : 0 } Following
                            </button>
                        </div>
                        <div className="followers follow">
                            <button className="post-link text-link" onClick={() => navigate(`follow`, {state: {initial_type: "followers"}})}>
                                { profile && profile.blocked_current_user ? profile.followers_count : follows ? follows : 0 } Followers
                            </button>
                        </div>

                    </div>
                    <div className="bio-container">
                        { profile ? profile.bio : "This is where my bio would go, if I wrote one!" }
                    </div>
                </div>
                <div className="interact-row">
                    <Row>
                        <Col>
                            {
                                isAuthenticated ?
                                    profile ? 
                                        profile.blocked_current_user ?
                                            <Button disabled className="rounded-btn profile-btn">
                                                Follow
                                            </Button>
                                        :
                                            profile.current_user ?
                                                <Button className="rounded-btn profile-btn edit-btn" onClick={ () => setShow(true) }>
                                                    Edit Profile
                                                </Button>
                                            :
                                                <Button className="rounded-btn profile-btn" onClick={ () => setFollow(profile.id) }>
                                                    { followed ? "Unfollow" : "Follow" } 
                                                </Button>
                                    :
                                        <Button className="rounded-btn profile-btn">
                                            Follow
                                        </Button>
                                :
                                    <Button className="rounded-btn profile-btn" onClick={ () => navigate("/login") }>
                                        Follow
                                    </Button>
                            }
                            <div className="more-user-interactions-btn">
                                <NavDropdown title={<BsThreeDots/>} 
                                    className="more-dropdown"
                                    drop={ aboveMid ? "up-centered" : "down-centered" }
                                    onClick={e => setAboveMid(e)}
                                >
                                    
                                </NavDropdown>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="user-content">
                    <Tabs fill>
                        <Tab eventKey="posts" title="Posts" id="is-active">
                            { profile && profile.blocked_current_user ?
                                <BlockedCard creator={profile.username} />
                            :
                                <PostArticle kwargs={{username: creator}} />
                            }
                        </Tab>
                        <Tab eventKey="replies" title="Replies">
                            { profile && profile.blocked_current_user ?
                                <BlockedCard creator={profile.username} />
                            :
                                <PostArticle kwargs={{username: creator, is_reply: true}} />
                            }
                        </Tab>
                        <Tab eventKey="monsters" title="Monsters">
                            { profile && profile.blocked_current_user ?
                                <BlockedCard creator={profile.username} />
                            :
                                "all of user's monsters"
                            }
                        </Tab>
                        <Tab eventKey="regions" title="Regions">
                            { profile && profile.blocked_current_user ?
                                <BlockedCard creator={profile.username} />
                            :
                                "all of user's regions"
                            }
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated});

export default connect(mapStateToProps, null)(ProfileInfo);