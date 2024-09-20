import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import ReplyBar from "./ReplyBar";
import { BsThreeDots } from "react-icons/bs";
import { useDeletePost, useMiddleViewPort } from "../hooks/hooks";
import { connect } from "react-redux";
import SocialInteractions from "./SocialInteractions";
import { Col, NavDropdown, Row } from "react-bootstrap";

import "../assets/styling/content.css";
import "../assets/styling/ViewPost.css"

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
                    <Row className="center-row-items">
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
                        <div className="mon-info">

                        </div>
                        <div className="mon-interactions">
                        <SocialInteractions />
                        </div>
                    </Row>

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