import { Fragment, useState } from "react";
import ReplyBar from "./ReplyBar";
import { BsThreeDots } from "react-icons/bs";
import { useDeletePost, useMiddleViewPort } from "../hooks/hooks";
import { connect } from "react-redux";
import SocialInteractions from "./SocialInteractions";
import { Col, NavDropdown, Row, Tab, Tabs } from "react-bootstrap";
import CultureTab from "./Content/CultureTab";
import GeographyTab from "./Content/GeographyTab";
import FeatureTab from "./Content/FeatureTab";
import TriviaTab from "./Content/TriviaTab";

import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";

function ViewRegion({ isAuthenticated }) {
    const [post, setPost] = useState("");
    const [showBlock, setShowBlock] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeletePost(false);
    const [tab, setTab] = useState("culture");

    // useEffect(() => {
    //     getPostById(pid).then((response) => {
    //         if(response && response.status === 403) {
    //             setPost(response.data);
    //         } else if(response && response.status === 200) {
    //             setPost(response.data);
    //             if(response.data["parent"]){
    //                getPostById(response.data["parent"]).then((parent_response) => {
    //                     if(parent_response && parent_response.status === 200) {
    //                         setParent(parent_response.data);
    //                     }
    //                 }) 
    //             }   
    //         }
    //     }).catch(e => {
    //     });
    // }, [pid]);

    function handleMoreClick() {
        return (
            <Fragment>
                { post.is_current_user ? 
                    <NavDropdown.Item onClick={() => { setIsDeleted(post.id) }}>
                        Delete Post
                    </NavDropdown.Item>
                : 
                    <NavDropdown.Item onClick={() => setShowBlock(true) }>
                        Block user
                    </NavDropdown.Item>
                }
            </Fragment>
        )
    }

    return (
        <>
            <div>
                <div className="article-container">
                    <Row className="view-name">
                        Deniz
                    </Row>
                    <Row className="center-row-items view-creator">
                        <Col>
                            <div className="creator-container">
                                @username
                            </div>
                        </Col>
                        <Col className="time-col" id="time-col">
                            <Row className="center-row-items">
                                <Col>
                                    12h
                                </Col>
                                <Col className="more-col">
                                    <div className="more-btn">
                                        <NavDropdown title={<BsThreeDots />} 
                                            drop={ aboveMid ? "up-centered" : "down-centered" }
                                            onClick={e => setAboveMid(e)}
                                            disabled={ !isAuthenticated }
                                        >
                                            { handleMoreClick() }
                                        </NavDropdown>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="bottom-barrier view-info-details">
                        <div className="view-img-container bottom-barrier">
                            <img src={ require("../assets/images/missing-img.png") } alt="Image is missing" className="view-image" />
                        </div>
                        <div view-desc>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget ligula massa. Nam imperdiet elit sed sem lacinia volutpat. Cras fermentum tempor nibh, eget maximus neque scelerisque quis. Nunc commodo cursus porttitor. Nulla laoreet enim sit amet purus scelerisque, quis vehicula massa blandit. Mauris eget aliquam purus. Nullam dolor leo, porta non metus nec, ultrices tincidunt elit. Fusce in augue eget leo faucibus tincidunt eget sit amet felis.
                            </p>
                            <p>    
                                Sed vitae quam sit amet velit dictum egestas. Vivamus vitae convallis nisi. Nam in nisi ultricies, elementum nunc sed, porttitor enim. Fusce fringilla nibh in turpis commodo ultrices. Vivamus lectus velit, mattis. 
                            </p>
                        </div>
                    </div>
                    <Tabs activeKey={ tab } onSelect={ (k) => setTab(k) } fill>
                        <Tab title="Culture" eventKey="culture">
                            <CultureTab />
                        </Tab>
                        <Tab title="Geography" eventKey="geography">
                            <GeographyTab />
                        </Tab>
                        <Tab title="Features" eventKey="features">
                            <FeatureTab />
                        </Tab>
                        <Tab title="Trivia" eventKey="trivia">
                            <TriviaTab />
                        </Tab>
                    </Tabs>
                    <div className="mon-interactions">
                        <SocialInteractions />
                    </div>
                </div>
                <div className="reply-container">
                    <ReplyBar />
                </div>
                <div className="comments-container article-container">
                    {/* <PostArticle query={ null } kwargs={ {parent: post.id} } /> */}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ViewRegion);