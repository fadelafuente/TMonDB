import { Fragment, useState } from 'react';
import { Col, Dropdown, DropdownButton, Row, Tab, Tabs } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { connect } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';

import PostArticles from '../../components/Articles/PostArticles';
import ReplyBar from '../../components/Bars/ReplyBar';
import { BlockedCard } from '../../components/Cards/BlockedCard';
import { FailedCard } from '../../components/Cards/FailedCard';
import LoadingCard from '../../components/Cards/LoadingCard';
import EvoChains from '../../components/Content/EvoChains';
import MovesTab from '../../components/Content/MovesTab';
import BlockModal from '../../components/Modals/BlockModal';
import StatChart from '../../components/TablesAndCharts/StatChart';
import WeaknessChart from '../../components/TablesAndCharts/WeaknessChart';
import SocialInteractions from '../../components/UserInteractions/SocialInteractions';
import { handleHeightConversion, handleKgToLbConversion, handleTimeDifference } from '../../functions/handlers';
import { useMiddleViewPort } from '../../hooks/misc/use-middle-viewport';
import { useDeleteResource } from '../../hooks/api/use-delete-resource';
import { useGetResourceById } from '../../hooks/api/use-get-resource-by-id';

import '../../assets/styling/content.css';
import '../../assets/styling/UserProfile.css';
import '../../assets/styling/ViewMon.css';

function ViewMon({ isAuthenticated }) {
    const { query } = useOutletContext();
     const [monster] = useGetResourceById('monsters');
    const [showBlock, setShowBlock] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeleteResource(false);
    const [tab, setTab] = useState('stats');
    const navigate = useNavigate();

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
                    <>
                        <Dropdown.Item onClick={() => { setIsDeleted(monster.id) }}>
                            Delete Monster
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate(`update`)}>
                            Update Monster
                        </Dropdown.Item>
                    </>
                : 
                    <Dropdown.Item onClick={() => setShowBlock(true) }>
                        Block user
                    </Dropdown.Item>
                }
            </Fragment>
        )
    }


    let [feet, inches] = ['???', '???']; 
    if(monster && monster.avg_height) {
        [feet, inches] = handleHeightConversion(monster.avg_height);
    }

    let lb = '???'; 
    if(monster && monster.avg_weight) {
        lb = handleKgToLbConversion(monster.avg_weight);
    }

    if(isDeleted) {
        return <FailedCard />;
    } else {
        return (
            <>
                { monster && typeof monster === 'object' ?
                    monster.current_user_is_blocked ?
                        <div className='article-container'>
                            <BlockedCard creator={monster.creator} />
                        </div>
                    :
                        monster.detail ? 
                            <div className='article-container'>
                                <FailedCard type="Monster" />
                            </div>
                            
                        :
                            <div>
                                <BlockModal show={showBlock} setShow={setShowBlock} setBlocked={() => window.location.reload()} username={ monster ? monster.article.creator.username : null } />
                                <div className='article-container'>
                                    <Row className='view-name'>
                                        { monster.name ? monster.name : '???' }
                                    </Row>
                                    <Row className='center-row-items view-creator'>
                                        <Col>
                                            <div className='creator-container'>
                                                @{ monster.article && monster.article.creator ? monster.article.creator.username : '???' }
                                            </div>
                                        </Col>
                                        <Col className='time-col' id='time-col'>
                                            <Row className='center-row-items'>
                                                <Col>
                                                    { monster.article && monster.article.date_created ? handleTimeDifference(monster.article.date_created) : '???' }
                                                </Col>
                                                <Col className='more-col'>
                                                    <div className='base-btn rounded-btn'>
                                                        <DropdownButton
                                                            className='base-btn rounded-btn'
                                                            drop={ aboveMid ? 'up-centered' : 'down-centered' }
                                                            onClick={e => setAboveMid(e)}
                                                            disabled={ !isAuthenticated }
                                                            variant='secondary'
                                                            title={ <BsThreeDots /> }>
                                                                { handleMoreClick() }
                                                        </DropdownButton>
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
                                                    { monster.national_id ? monster.national_id : '???' }
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
                                                    { monster.species ? monster.species : '???' }
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
                                                        <a href='/' className='text-link'>D0T_M4ST3R</a>
                                                        <a href='/' className='text-link'>Synergy Master</a>
                                                    </div>
                                                </div>
                                            </div><div className='mon-detail mon-detail-types'>
                                                <div className='mon-detail-tag'>
                                                    H. Ability
                                                </div>
                                                <div className='mon-detail-data'>
                                                    <div className='mon-abilities'>
                                                        <a href='/' className='text-link'>Intimidate</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mon-detail mon-detail-region'>
                                                <div className='mon-detail-tag'>
                                                    Avg Ht
                                                </div>
                                                <div className='mon-detail-data'>
                                                    { feet }'{ inches }' ({ monster.avg_height ? monster.avg_height : '???' } m)
                                                </div>
                                            </div>
                                            <div className='mon-detail mon-detail-region'>
                                                <div className='mon-detail-tag'>
                                                    Avg Wt
                                                </div>
                                                <div className='mon-detail-data'>
                                                    { lb } lbs ({ monster.avg_weight ? monster.avg_weight : '???' } kg)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='bottom-barrier'>
                                        <div className='mon-desc-tag'>
                                            Description
                                        </div>
                                        <p>
                                            { monster.description ? monster.description : 'Data not found. Stay safe out there, researchers.' }
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
                                        <SocialInteractions resource='monsters' obj={ monster } />
                                    </div>
                                </div>
                                <div className='reply-container'>
                                    <ReplyBar parent={ monster && monster.article ? monster.article.id : null } />
                                </div>
                                <div className='comments-container article-container'>
                                    <PostArticles query={ query } kwargs={ { parent: monster.article ? monster.article.id : null } } />
                                </div>
                            </div>
                :
                    <LoadingCard />
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ViewMon);