import { React, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { BsDot } from 'react-icons/bs';

import BlockModal from '../Modals/BlockModal';
import SocialInteractions from '../UserInteractions/SocialInteractions';
import { handleHeightConversion, handleKgToLbConversion, handleTimeDifference } from '../../functions/handlers';

import '../../assets/styling/MonCard.css';

export default function MonsterCard({monster=null}) {
    const [showBlock, setShowBlock] = useState(false);
    const [blocked, setBlocked] = useState(false);

    let [feet, inches] = ['???', '???']; 
    if(monster && monster.avg_height) {
        [feet, inches] = handleHeightConversion(monster.avg_height);
    }

    let lb = '???'; 
    if(monster && monster.avg_weight) {
        lb = handleKgToLbConversion(monster.avg_weight);
    }

    return (
        <>
            <BlockModal show={showBlock} setShow={setShowBlock} setBlocked={setBlocked} username={ monster ? monster.article.creator.username : null } />
            <div className='card-outer-background'>
                <div className='card-inner-background'>
                    <Card className='inner-card'>
                        <Card.Header className='mon-card-header'>
                            <Row className='center-row-items'>
                                <Col className='monster-creator-container'>
                                    <div className='monster-text-emphasis'>
                                        { monster.name ? monster.name : '???' }
                                    </div>
                                    <div>
                                        {
                                            monster && monster.article.creator.username ? 
                                                <div className='creator-container'>
                                                    <a href={ `/${monster.article.creator.username}` }>
                                                        @{ monster.article && monster.article.creator ? monster.article.creator.username : '???' }
                                                    </a> <BsDot /> { monster ? handleTimeDifference(monster.article.date_created) : '0s' }
                                                </div>
                                        :
                                            '[Deleted]'
                                        }
                                    </div>
                                </Col>
                                <Col className='time-col' id='time-col'>
                                    <Row className='center-row-items'>
                                        <Col className='type-container'>
                                            <div className='monster-type-icon'></div>
                                            <div className='monster-type-icon'></div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body className='mon-card-body'>
                            <Row className='image-aspect-container'>
                                <Row className='image-container'>
                                </Row>
                            </Row>
                            <Row>
                                <Row className='top-barrier monster-outer-misc-container'>
                                    <div className='row-gap-container monster-inner-misc-container'>
                                        <div className='species-container'>
                                            The { monster.species ? monster.species : '???' } { monster.world && monster.world.monster_alias ? monster.world.monster_alias : 'Monster' }
                                        </div>
                                        <div className='adjust-basis-container'>
                                            { feet && inches ? `${feet}' ${inches}"` : '???\' ???"' }
                                        </div>
                                        <div className='adjust-basis-container'>
                                            { lb ? `${lb}lb` : '???lb' }
                                        </div>
                                    </div>
                                </Row>
                                <Row className='description' id='description'>
                                    { monster.description ? monster.description : '???' }
                                </Row>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <SocialInteractions resource='monsters' />
                        </Card.Footer>
                    </Card>
                </div>
            </div>
        </>
    )
}