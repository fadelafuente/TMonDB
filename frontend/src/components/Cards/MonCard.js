import { Fragment, React, useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Button, Card, Col, NavDropdown, Row } from 'react-bootstrap';
import BlockModal from '../Modals/BlockModal';
import { connect } from 'react-redux';
import { useDeletePost, useMiddleViewPort, useTimedAlert } from '../../hooks/hooks';
import { handleTimeDifference } from '../../functions/handlers';

import '../../assets/styling/MonCard.css';
import SocialInteractions from '../SocialInteractions';
import { DeletedCard } from './DeletedCard';

function MonCard({post=null, isAuthenticated}) {
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [showBlock, setShowBlock] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [isDeleted, setIsDeleted] = useDeletePost(false);
    const desc = useRef();

    useEffect(() => {
        if(!desc?.current) return;

        const resizeObserver = new ResizeObserver(() => {
            const description = document.getElementById("desc-span");
            const computedSize = window.getComputedStyle(description).fontSize;
            const numLines = Math.floor(desc.current.clientHeight / (parseInt(computedSize.substring(0,2)) * 1.4)) - 1;
            description.style.webkitLineClamp = numLines;
            description.style.lineClamp = numLines;
        });

        resizeObserver.observe(desc.current);
        
        return () => resizeObserver.disconnect();
    }, []);

    function handleMoreClick() {
        return (
            <Fragment>
                { post && post.is_current_user ? 
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

    if(isDeleted) {
        return <DeletedCard />;
    } else {
        return (
            <>
                <BlockModal show={showBlock} setShow={setShowBlock} setBlocked={setBlocked} username={ post ? post.creator_username : null } />
                <div className="article-container">
                    <div className='card-background-aspect'>
                        <div className="aspect-border">
                            <Card className='aspect-inner'>
                                <Card.Header className="mon-card-header">
                                    <Row className="center-row-items">
                                        <Col>
                                            <div className="creator-container">
                                                {
                                                    post && post.creator_username ? 
                                                        <a href={ `/${post.creator_username}` }>
                                                            { post.creator_username }
                                                        </a>
                                                    :
                                                    "[Deleted]"
                                                }
                                            </div>
                                        </Col>
                                        <Col className="time-col" id="time-col">
                                            <Row className="center-row-items">
                                                <Col>
                                                    { post ? handleTimeDifference(post.posted_date) : "0s" }
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
                                </Card.Header>
                                <Card.Body className="mon-card-body">
                                    <div className="image-aspect-container">
                                        <Row className='image-container'>
                                                
                                        </Row>
                                    </div>
                                    <Row className='content-text'>
                                        <Row className="mon-info">
                                            <Col className="mon-name">
                                                <h3>Bulbasaur</h3>
                                                <div className='mon-species'>
                                                    The Bulb Pokemon
                                                </div>
                                            </Col>
                                            <Col className='typing'>
                                                <Button href='/trending' className='links type1'>GRA</Button>
                                                <Button href='/trending' className='links type2'>POI</Button>
                                            </Col>
                                        </Row>
                                        <div className='description' id='description' ref={desc}>
                                                <span id='desc-span'>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                                </span>
                                        </div>
                                    </Row>
                                </Card.Body>
                                <Card.Footer>
                                    <SocialInteractions />
                                </Card.Footer>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(MonCard);