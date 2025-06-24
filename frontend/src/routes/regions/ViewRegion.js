import { Fragment, useState } from 'react';
import { Col, NavDropdown, Row, Tab, Tabs } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { connect } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ReplyBar from '../../components/Bars/ReplyBar';
import CultureTab from '../../components/Content/CultureTab';
import FeatureTab from '../../components/Content/FeatureTab';
import GeographyTab from '../../components/Content/GeographyTab';
import TriviaTab from '../../components/Content/TriviaTab';
import { useDeleteResource } from '../../hooks/api/use-delete-resource';
import { useMiddleViewPort } from '../../hooks/misc/use-middle-viewport';
import SocialInteractions from '../../components/UserInteractions/SocialInteractions';

import '../../assets/styling/content.css';
import '../../assets/styling/UserProfile.css';
import '../../assets/styling/ViewMon.css';
import '../../assets/styling/buttons.css';

function ViewRegion({ isAuthenticated }) {
    const { query } = useOutletContext();
    const [region, setRegion] = useState({});
    const [showBlock, setShowBlock] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeleteResource(false);
    const [tab, setTab] = useState('culture');

    function handleMoreClick() {
        return (
            <Fragment>
                { region.is_current_user ? 
                    <NavDropdown.Item onClick={() => { setIsDeleted('regions', region.id) }}>
                        Delete Region
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
                <div className='article-container'>
                    <Row className='view-name'>
                        Deniz
                    </Row>
                    <Row className='center-row-items view-creator'>
                        <Col>
                            <div className='creator-container'>
                                @username
                            </div>
                        </Col>
                        <Col className='time-col' id='time-col'>
                            <Row className='center-row-items'>
                                <Col>
                                    12h
                                </Col>
                                <Col className='more-col'>
                                    <div className='base-btn rounded-btn'>
                                        <NavDropdown title={<BsThreeDots />} 
                                            drop={ aboveMid ? 'up-centered' : 'down-centered' }
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
                    <div className='bottom-barrier view-info-details'>
                        <div className='view-img-container bottom-barrier'>
                            <img src={ require('../assets/images/missing-img.png') } className='view-image' />
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
                        <Tab title='Culture' eventKey='culture'>
                            <CultureTab />
                        </Tab>
                        <Tab title='Geography' eventKey='geography'>
                            <GeographyTab />
                        </Tab>
                        <Tab title='Features' eventKey='features'>
                            <FeatureTab />
                        </Tab>
                        <Tab title='Trivia' eventKey='trivia'>
                            <TriviaTab />
                        </Tab>
                    </Tabs>
                    <div className='mon-interactions'>
                        <SocialInteractions resource='regions' />
                    </div>
                </div>
                <div className='reply-container'>
                    <ReplyBar parent={ region && region.article ? region.article.id : null } />
                </div>
                <div className='comments-container article-container'>
                    {/* <PostArticles query={ query } kwargs={ {parent: region.article.id} } /> */}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ViewRegion);