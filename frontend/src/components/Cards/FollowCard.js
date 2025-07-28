import { useNavigate } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';

import { useGetProfile } from '../../hooks/profile/use-get-profile';

import '../../assets/styling/PostCard.css';
import '../../assets/styling/UserProfile.css';

export default function FollowCard({ user }) {
  const [, followed, , setFollow] = useGetProfile(user.username);
  const navigate = useNavigate();

  return (
    <>
      <div className='row-gap-container item-card'>
        <div className='pfp-image'>pfp</div>
        <div className='f-user-details'>
          <div className='row-gap-container'>
            <Col className='follow-username'>
              @{ user ? user.username : 'Anonymous' }
            </Col>
            <Col className='align-right'>
              {user.current_user ? (
                <Button
                  className='base-btn reverse-base-btn'
                  onClick={ () => navigate(`/${user.username}`) }
                >
                  Profile
                </Button>
              ) : (
                <Button
                  className='base-btn reverse-base-btn'
                  onClick={() => {
                    user ? setFollow(user.id) : navigate('/login');
                  }}
                >
                  { followed ? 'Unfollow' : 'Follow' }
                </Button>
              )}
            </Col>
          </div>
          <div>
            { user ? user.bio : 'This is a fantastic bio! A little empty though, no?' }
          </div>
        </div>
      </div>
    </>
  );
}
