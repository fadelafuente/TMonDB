import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import ReplyBar from "./ReplyBar";
import { BsThreeDots } from "react-icons/bs";
import { useDeletePost, useMiddleViewPort } from "../hooks/hooks";
import { connect } from "react-redux";
import SocialInteractions from "./SocialInteractions";
import { Col, NavDropdown, Row } from "react-bootstrap";

import "../assets/styling/content.css";
import "../assets/styling/ViewMon.css";

function ViewMon({ isAuthenticated }) {
    const { mid } = useParams();
    const [post, setPost] = useState("");
    const [showBlock, setShowBlock] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeletePost(false);

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
                    <Row className="mon-name">
                        lizardmon
                    </Row>
                    <Row className="center-row-items mon-creator">
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
                    <div>
                        <div className="mon-info-chart">
                            <div className="mon-image-aspect-container">
                                <div className='mon-image-container'>
                                        
                                </div>
                            </div>
                            <div className="mon-info-details">
                                <div className="mon-detail national-id">
                                    <div className="mon-detail-tag">
                                        National id
                                    </div>
                                    <div className="mon-detail-data">
                                        1234
                                    </div>
                                </div>
                                <div className="mon-detail mon-detail-types">
                                    <div className="mon-detail-tag">
                                        Type(s)
                                    </div>
                                    <div className="mon-detail-data">
                                        gra gro
                                    </div>
                                </div>
                                <div className="mon-detail mon-detail-species">
                                    <div className="mon-detail-tag">
                                        Species
                                    </div>
                                    <div className="mon-detail-data">
                                        Quintus Lizardus
                                    </div>
                                </div>
                                <div className="mon-detail mon-detail-region">
                                    <div className="mon-detail-tag">
                                        Region
                                    </div>
                                    <div className="mon-detail-data">
                                        Firstilionius
                                    </div>
                                </div>
                                <div className="mon-detail mon-detail-types">
                                    <div className="mon-detail-tag">
                                        Abilities
                                    </div>
                                    <div className="mon-detail-data">
                                        <div className="mon-abilities">
                                            <a href="#" className="text-link">D0T_M4ST3R</a>
                                            <a href="#" className="text-link">Synergy Master</a>
                                        </div>
                                    </div>
                                </div><div className="mon-detail mon-detail-types">
                                    <div className="mon-detail-tag">
                                        H. Ability
                                    </div>
                                    <div className="mon-detail-data mon-abilities">
                                        <a href="#" className="text-link">Intimidate</a>
                                    </div>
                                </div>
                                <div className="mon-detail mon-detail-region">
                                    <div className="mon-detail-tag">
                                        Avg Ht
                                    </div>
                                    <div className="mon-detail-data">
                                        3'07"
                                    </div>
                                </div>
                                <div className="mon-detail mon-detail-region">
                                    <div className="mon-detail-tag">
                                        Avg Wt
                                    </div>
                                    <div className="mon-detail-data">
                                        100 lbs
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mon-interactions">
                            <SocialInteractions />
                        </div>
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

export default connect(mapStateToProps, null)(ViewMon);