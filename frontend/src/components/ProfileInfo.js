import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Col, Row, Tab, Tabs, NavDropdown } from 'react-bootstrap';
import { useMiddleViewPort } from '../hooks/hooks';
import { BsThreeDots } from 'react-icons/bs';
import PostArticle from './PostArticle';

import "../assets/styling/PostCard.css";
import "../assets/styling/UserProfile.css";

function ProfileInfo({ isAuthenticated }) {
    const { creator } = useParams();
    const [aboveMid, setAboveMid] = useMiddleViewPort();

    return (
        <>
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
                            @{creator}
                        </div>
                    </div>
                    <div className="bio-container">
                        This is a bio about the user!
                    </div>
                </div>
                <div className="interact-row">
                    <Row>
                        <Col>
                            <Button className="rounded-btn follow-btn">
                                Follow
                            </Button>
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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ProfileInfo);