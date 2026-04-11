import { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { BsDot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

import BlockModal from '../Modals/BlockModal';
import SocialInteractions from '../UserInteractions/SocialInteractions';
import {
  handleHeightConversion,
  handleKgToLbConversion,
  handleTimeDifference,
} from '../../functions/handlers';

import '../../assets/styling/MonCard.css';

export default function MonsterCard({ data = null }) {
  const [showBlock, setShowBlock] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();

  let [feet, inches] = ['???', '???'];
  if(data && data.avg_height) {
    [feet, inches] = handleHeightConversion(data.avg_height);
  }

  let lb = '???';
  if(data && data.avg_weight) {
    lb = handleKgToLbConversion(data.avg_weight);
  }

  function handleNavigateToCreatorProfile(e) {
    e.preventDefault();
    navigate(`/${data.article.creator.username}`);
  }

  return (
    <>
      <BlockModal
        show={ showBlock }
        setShow={setShowBlock}
        setBlocked={setBlocked}
        username={ data ? data.article.creator.username : null }
      />
      <div className='card-outer-background'>
        <div className='card-inner-background'>
          <Card className='inner-card'>
            <Card.Header className='mon-card-header'>
              <Row className='center-row-items'>
                <Col className='monster-creator-container'>
                  <div className='monster-text-emphasis'>
                    { data.name ? data.name : '???' }
                  </div>
                  <div>
                    {data && data.article.creator.username ? (
                      <div className='creator-container'>
                        <button
                          className='link-as-button'
                          onClick={ (e) => handleNavigateToCreatorProfile(e) }
                        >
                          @
                          {data.article && data.article.creator
                            ? data.article.creator.username
                            : '???'}
                        </button>
                        <div>
                          <BsDot />
                          {data
                            ? handleTimeDifference(data.article.date_created)
                            : '0s'}
                        </div>
                      </div>
                    ) : (
                      '[Deleted]'
                    )}
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
                <Row className='image-container'></Row>
              </Row>
              <Row>
                <Row className='top-barrier monster-outer-misc-container'>
                  <div className='row-gap-container monster-inner-misc-container'>
                    <div className='species-container'>
                      The {data.species ? data.species : '???'}{' '}
                      {data.world && data.world.monster_alias
                        ? data.world.monster_alias
                        : 'Monster'}
                    </div>
                    <div className='adjust-basis-container'>
                      { feet && inches ? `${feet}' ${inches}'` : '???\' ???"' }
                    </div>
                    <div className='adjust-basis-container'>
                      { lb ? `${lb}lb` : '???lb' }
                    </div>
                  </div>
                </Row>
                <Row className='description' id='description'>
                  { data.description ? data.description : '???' }
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
  );
}