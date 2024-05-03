import { useParams } from 'react-router-dom';
import { Button, Col, Row, Tab, Tabs, NavDropdown } from 'react-bootstrap';
import { useGetProfile, useMiddleViewPort } from '../hooks/hooks';
import { BsThreeDots } from 'react-icons/bs';
import PostArticle from './PostArticle';
import EditModal from './EditModal';
import { useState } from 'react';

import "../assets/styling/PostCard.css";
import "../assets/styling/UserProfile.css";

export default function ProfileInfo() {
    const { creator } = useParams();
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [profile, followed, follows, setFollow] = useGetProfile(creator);
    const [show, setShow] = useState(false);

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
                            <a href="#">
                                { profile ? profile.following_count : 0 } Following
                            </a>
                        </div>
                        <div className="followers follow">
                            <a href="#">
                                { follows ? follows : 0 } Followers
                            </a>
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
                                profile ? 
                                    profile.current_user ?
                                        <Button className="rounded-btn profile-btn edit-btn" onClick={() => setShow(true)}>
                                            Edit Profile
                                        </Button>
                                        :
                                        <Button className="rounded-btn profile-btn" onClick={() => setFollow(profile.id)}>
                                            { followed ? "Unfollow" : "Follow" } 
                                        </Button>
                                :
                                    <Button className="rounded-btn profile-btn">
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
                            <PostArticle kwargs={{username: creator}} />
                        </Tab>
                        <Tab eventKey="replies" title="Replies">
                            <PostArticle kwargs={{username: creator, is_reply: true}} />
                        </Tab>
                        <Tab eventKey="monsters" title="Monsters">
                            all of user's monsters
                        </Tab>
                        <Tab eventKey="regions" title="Regions">
                            all of user's regions
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
 
}