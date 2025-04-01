import { Fragment, useState } from 'react';
import { Col, NavDropdown, Row, Tab, Tabs } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { connect } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import ReplyBar from './Bars/ReplyBar';
import EvoChains from './Content/EvoChains';
import MovesTab from './Content/MovesTab';
import MovesTable from './TablesAndCharts/MovesTable';
import StatChart from './TablesAndCharts/StatChart';
import WeaknessChart from './TablesAndCharts/WeaknessChart';
import SocialInteractions from './UserInteractions/SocialInteractions';
import { useDeleteResource, useMiddleViewPort } from '../hooks/hooks';

import '../assets/styling/content.css';
import '../assets/styling/UserProfile.css';
import '../assets/styling/ViewMon.css';

function ViewMon({ isAuthenticated }) {
    const { query } = useOutletContext();
    const { mid } = useParams();
    const [monster, setMonster] = useState('');
    const [showBlock, setShowBlock] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeleteResource(false);
    const [tab, setTab] = useState('stats');


    const levelMoves = [
        {method_value: 19, name: 'Fire Fang', type: 'Fire', power: 65},
        {method_value: 24, name: 'Slash', type: 'Normal', power: 70},
        {method_value: 30, name: 'Flamethrower', type: 'Fire', power: 90},
        {method_value: 37, name: 'Scary Face', type: 'Normal', Power: null},
        {method_value: 48, name: 'Inferno', type: 'Fire', power: 100},
        {method_value: 54, name: 'Flare Blitz', type: 'Fire', power: 120}
    ];

    const courseMoves = [
        {method_value: 1, name: 'Take Down', type: 'Normal', power: 90},
        {method_value: 7, name: 'Protect', type: 'Normal', power: null},
        {method_value: 58, name: 'Brick Break', type: 'Fighting', power: 75},
        {method_value: 67, name: 'Fire Punch', type: 'Fire', Power: 75},
        {method_value: 68, name: 'Thunder Punch', type: 'Electric', power: 75},
        {method_value: 78, name: 'Dragon Claw', type: 'Dragon', power: 80}
    ];

    const courseTotal = 140;

    function handleMoreClick() {
        return (
            <Fragment>
                { monster.is_current_user ? 
                    <NavDropdown.Item onClick={() => { setIsDeleted(monster.id) }}>
                        Delete Monster
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
                        lizardmon
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
                    <div className='mon-info-details bottom-barrier'>
                        <div className='mon-image-aspect-container'>
                            <div className='mon-image-container'>
                                    
                            </div>
                        </div>
                        <div className='mon-info-chart'>
                            <div className='mon-detail national-id'>
                                <div className='mon-detail-tag'>
                                    National id
                                </div>
                                <div className='mon-detail-data'>
                                    1234
                                </div>
                            </div>
                            <div className='mon-detail mon-detail-types'>
                                <div className='mon-detail-tag'>
                                    Type(s)
                                </div>
                                <div className='mon-detail-data'>
                                    gra gro
                                </div>
                            </div>
                            <div className='mon-detail mon-detail-species'>
                                <div className='mon-detail-tag'>
                                    Species
                                </div>
                                <div className='mon-detail-data'>
                                    Quintus Lizardus
                                </div>
                            </div>
                            <div className='mon-detail mon-detail-region'>
                                <div className='mon-detail-tag'>
                                    Region
                                </div>
                                <div className='mon-detail-data'>
                                    Firstilionius
                                </div>
                            </div>
                            <div className='mon-detail mon-detail-types'>
                                <div className='mon-detail-tag'>
                                    Abilities
                                </div>
                                <div className='mon-detail-data'>
                                    <div className='mon-abilities'>
                                        <a href='#' className='text-link'>D0T_M4ST3R</a>
                                        <a href='#' className='text-link'>Synergy Master</a>
                                    </div>
                                </div>
                            </div><div className='mon-detail mon-detail-types'>
                                <div className='mon-detail-tag'>
                                    H. Ability
                                </div>
                                <div className='mon-detail-data'>
                                    <div className='mon-abilities'>
                                        <a href='#' className='text-link'>Intimidate</a>
                                    </div>
                                </div>
                            </div>
                            <div className='mon-detail mon-detail-region'>
                                <div className='mon-detail-tag'>
                                    Avg Ht
                                </div>
                                <div className='mon-detail-data'>
                                    3'07' (1.1 m)
                                </div>
                            </div>
                            <div className='mon-detail mon-detail-region'>
                                <div className='mon-detail-tag'>
                                    Avg Wt
                                </div>
                                <div className='mon-detail-data'>
                                    100 lbs (45.5 kg)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bottom-barrier'>
                        <div className='mon-desc-tag'>
                            Description
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget ligula massa. Nam imperdiet elit sed sem lacinia volutpat. Cras fermentum tempor nibh, eget maximus neque scelerisque quis. Nunc commodo cursus porttitor. Nulla laoreet enim sit amet purus scelerisque, quis vehicula massa blandit. Mauris eget aliquam purus. Nullam dolor leo, porta non metus nec, ultrices tincidunt elit. Fusce in augue eget leo faucibus tincidunt eget sit amet felis.
                            Sed vitae quam sit amet velit dictum egestas. Vivamus vitae convallis nisi. Nam in nisi ultricies, elementum nunc sed, porttitor enim. Fusce fringilla nibh in turpis commodo ultrices. Vivamus lectus velit, mattis. 
                        </p>
                    </div>
                    <Tabs defaultActiveKey={ tab } activeKey={ tab } onSelect={(k) => setTab(k)} fill>
                        <Tab title='Stats' eventKey='stats'>
                            <StatChart />
                        </Tab>
                        <Tab title='Weaknesses' eventKey='weaknesses'>
                            <WeaknessChart />
                        </Tab>
                        <Tab title='Moves' eventKey='moves'>
                            <MovesTab levelMoves={ levelMoves } courseMoves={ courseMoves } courseTotal={ courseTotal } />
                        </Tab>
                        <Tab title='Evo. Chain' eventKey='evoChain'>
                            <EvoChains />
                        </Tab>
                    </Tabs>
                    <div className='mon-interactions'>
                        <SocialInteractions resource='monsters' />
                    </div>
                </div>
                <div className='reply-container'>
                    <ReplyBar />
                </div>
                <div className='comments-container article-container'>
                    {/* <PostArticles query={ null } kwargs={ {parent: monster.article.id} } /> */}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ViewMon);