import { Fragment } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { handleTimeDifference } from '../../../functions/handlers';
import { useMiddleViewPort } from '../../../hooks/misc/use-middle-viewport';

import '../../../assets/styling/Article.css';

function ArticleHeader({ type, data, isAuthenticated, setIsDeleted, setShowBlock }) {
  const [aboveMid, setAboveMid] = useMiddleViewPort();
  const navigate = useNavigate();

  function handleMoreClick() {
    return (
      <Fragment>
        { data.is_current_user ? 
          <>
            <Dropdown.Item onClick={() => { setIsDeleted(data.id) }}>
              Delete { type }
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate(`update`)}>
              Update { type }
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

  return (
    <header className='article-header bottom-barrier'>
      <div className='article-header-top'>
        <h3 className='article-name'>{ data.name }</h3>
        <div className='article-actions'>
          { data.article.date_created ? handleTimeDifference(data.article.date_created) : '???' }
          <div className='base-btn rounded-btn'>
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
          </div>
        </div>
      </div>
      @{ data.article.creator ? data.article.creator.username : '???' }
    </header>
  );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ArticleHeader);