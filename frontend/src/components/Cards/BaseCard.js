import { Fragment, useState, useEffect } from 'react';
import { Col, Placeholder, Row, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { DeletedCard } from './DeletedCard';
import ImageGallery from '../ImageGallery';
import DeleteResourceModal from '../Modals/DeleteResourceModal';
import BlockModal from '../Modals/BlockModal';
import SocialInteractions from '../UserInteractions/SocialInteractions';
import { handleTimeDifference } from '../../functions/handlers';
import { useDeleteResource } from '../../hooks/features/api/use-delete-resource';
import { useMiddleViewPort } from '../../hooks/misc/use-middle-viewport';

import '../../assets/styling/PostCard.css';

export default function BaseCard({ data={}, type='posts', onUpdate=null, label='Post' }) {
  const [showBlock, setShowBlock] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [aboveMid, setAboveMid] = useMiddleViewPort();
  const [showDelete, setShowDelete] = useState(false);
  const { data: isDeleted, mutate: setIsDeleted } = useDeleteResource(type);
  const { isAuthenticated } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(blocked) {
      window.location.reload();
    }
  }, [blocked])

  function handleMoreClick() {
    return (
      <Fragment>
        { data.is_current_user ?
          <>
            <Dropdown.Item 
              onClick={() => setShowDelete(true) }
              as={ 'button' }
            >
              Delete { label }
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={ onUpdate ? onUpdate : () => navigate(`/db/${type}/${data.id}/update`) }
              as={ 'button' }
            >
              Update { label }
            </Dropdown.Item>
          </>
        :
          <Dropdown.Item 
            onClick={() => setShowBlock(true) }
            as={ 'button' }
          >
            Block user
          </Dropdown.Item>
        }
      </Fragment>
    )
  }

  function handleNavigate(e) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${data.article.creator.username}`);
  }

  function handleDelete() {
    setShowDelete(() => {
      setIsDeleted(data.id);
      return false;
    });
  }

  if(isDeleted) {
    return <DeletedCard />;
  } else {
    return (
      <>
        <BlockModal show={ showBlock } setShow={ setShowBlock } setBlocked={ setBlocked } username={ data ? data.article.creator.username : null } />
        <DeleteResourceModal show={ showDelete } setShow={ setShowDelete } handleDelete={ handleDelete } label={ label.toLowerCase() } />
        <Card>
          <a 
            className='obj-link'
            href={ 
              type === 'posts' && data && data.article ? 
                `/${data.article.creator.username}/${data.id}` 
              : 
                data && data.article ? 
                  `/db/${type}/${data.id}` 
                : '/' 
            }
          >
            <Card.Body>
              <Card.Title>
                <Row className='center-row-items'>
                  <Col>
                    <div className='creator-container'>
                      { data && data.article.creator.username ?
                        <button className='link-as-button' onClick={ e => handleNavigate(e) }>
                          @{ data.article.creator.username }
                        </button>
                      :
                        '[Deleted]'
                      }
                    </div>
                  </Col>
                  <Col className='time-col' id='time-col'>
                    <Row className='center-row-items'>
                      <Col>
                        { data ? handleTimeDifference(data.article.date_created) : <Placeholder xs={4} /> }
                      </Col>
                      <Col className='more-col'>
                        <DropdownButton
                          className='base-btn rounded-btn'
                          drop={ aboveMid ? 'up-centered' : 'down-centered' }
                          onClick={ e => setAboveMid(e) }
                          disabled={ !isAuthenticated }
                          variant='secondary'
                          title={ <BsThreeDots /> }
                        >
                          { handleMoreClick() }
                        </DropdownButton>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Title>

              <div className='image-gallery' id='image-gallery'>
                { data ? <ImageGallery gallery={ data.image } /> : <ImageGallery gallery={ null } uploaded={ false } /> }
              </div>

              { data ?
                <Card.Text className='include-newlines'>
                  { data.content ? data.content : data.description ? data.description : 'Records not available, more research is required.' }
                </Card.Text>
              :
                <Placeholder as={ Card.Text } animation='wave'>
                  <Placeholder xs={ 7 } /> <Placeholder xs={ 4 } /> <Placeholder xs={ 4 } />{ ' ' }
                  <Placeholder xs={ 6 } /> <Placeholder xs={ 8 } />
                </Placeholder>
              }
            </Card.Body>
          </a>
          <Card.Footer className='no-select'>
            <SocialInteractions resource={ type } obj={ data } />
          </Card.Footer>
        </Card>
      </>
    );
  }
}