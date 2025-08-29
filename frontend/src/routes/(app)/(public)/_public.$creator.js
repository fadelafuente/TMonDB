import { useState } from 'react';
import {
  Button,
  Col,
  Row,
  Tab,
  Tabs,
  NavDropdown,
  Alert,
} from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import InfiniteResourceScroll from '../../../components/InfiniteScrolls/InfiniteResourceScroll';
import { BlockedCard } from '../../../components/Cards/BlockedCard';
import LoadingCard from '../../../components/Cards/LoadingCard';
import MonsterCard from '../../../components/Cards/MonsterCard';
import PostCard from '../../../components/Cards/PostCard';
import { ViewBlockedUserCard } from '../../../components/Cards/ViewingBlockedUserCard';
import BlockModal from '../../../components/Modals/BlockModal';
import EditModal from '../../../components/Modals/EditModal';
import { useTimedAlert } from '../../../hooks/misc/use-timed-alert';
import { useMiddleViewPort } from '../../../hooks/misc/use-middle-viewport';
import { useGetProfile } from '../../../hooks/profile/use-get-profile';

import '../../../assets/styling/PostCard.css';
import '../../../assets/styling/UserProfile.css';

export default function ProfileComponent() {
  const { creator } = useParams();
  const { isAuthenticated } = useOutletContext();
  const [aboveMid, setAboveMid] = useMiddleViewPort();
  const [profile, followed, follows, setFollow] = useGetProfile(creator);
  const [show, setShow] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showAlert, setShowAlert] = useTimedAlert(false);
  const navigate = useNavigate();

  function handleCopyLink(path) {
    navigator.clipboard.writeText(`${process.env.REACT_APP_WEB_URL}/${path}`);
    setShowAlert(true);
  }

  if (profile && profile.user_blocks) {
    return (
      <div className='article-container'>
        <ViewBlockedUserCard creator={creator} />
      </div>
    );
  } else {
    return (
      <>
        {profile ? (
          <div>
            <BlockModal
              show={showBlock}
              setShow={setShowBlock}
              setBlocked={() => {
                window.location.reload();
              }}
              username={profile ? profile.username : null}
            />
            <EditModal show={show} setShow={() => setShow()} />
            <Alert variant='success' className='copy-alert' show={showAlert}>
              <Alert.Heading>Copied to clipboard.</Alert.Heading>
            </Alert>
            <div className='banner-container'></div>
            <div className='profile-info-container'>
              <div className='about-user-container'>
                <div className='user-row'>
                  <div className='pfp-outer-container'>
                    <div className='pfp-container'></div>
                  </div>
                  <div className='username-container'>
                    @{profile && profile.username ? profile.username : creator}
                  </div>
                </div>
                <div className='row-gap-container'>
                  <div className='follow'>
                    <button
                      className='obj-link text-link'
                      onClick={() =>
                        navigate(`follow`, {
                          state: { initial_type: 'following' },
                        })
                      }
                    >
                      {profile && profile.following_count
                        ? profile.following_count
                        : 0}{' '}
                      Following
                    </button>
                  </div>
                  <div className='followers follow'>
                    <button
                      className='obj-link text-link'
                      onClick={() =>
                        navigate(`follow`, {
                          state: { initial_type: 'followers' },
                        })
                      }
                    >
                      {profile && profile.followers_count
                        ? profile.followers_count
                        : follows
                        ? follows
                        : 0}{' '}
                      Followers
                    </button>
                  </div>
                </div>
                <div className='bio-container'>
                  {profile
                    ? profile.bio
                    : 'This is where my bio would go, if I wrote one!'}
                </div>
              </div>
              <div className='interact-row'>
                <Row>
                  <Col className='row-gap-container'>
                    {isAuthenticated ? (
                      profile ? (
                        profile.current_user_is_blocked ? (
                          <Button
                            disabled
                            className='base-btn reverse-base-btn'
                          >
                            Follow
                          </Button>
                        ) : profile.current_user ? (
                          <Button
                            className='base-btn reverse-base-btn edit-btn'
                            onClick={() => setShow(true)}
                          >
                            Edit Profile
                          </Button>
                        ) : (
                          <Button
                            className='base-btn reverse-base-btn'
                            onClick={() => setFollow(profile.username)}
                          >
                            {followed ? 'Unfollow' : 'Follow'}
                          </Button>
                        )
                      ) : (
                        <Button className='base-btn reverse-base-btn'>
                          Follow
                        </Button>
                      )
                    ) : (
                      <Button
                        className='base-btn reverse-base-btn'
                        onClick={() => navigate('/login')}
                      >
                        Follow
                      </Button>
                    )}
                    <div className='base-btn rounded-btn bigger-rounded-btn'>
                      <NavDropdown
                        title={<BsThreeDots />}
                        className='more-dropdown'
                        drop={aboveMid ? 'up-centered' : 'down-centered'}
                        onClick={(e) => setAboveMid(e)}
                      >
                        {isAuthenticated &&
                        profile &&
                        !profile.current_user &&
                        !profile.is_blocking ? (
                          <NavDropdown.Item onClick={() => setShowBlock(true)}>
                            Block user
                          </NavDropdown.Item>
                        ) : (
                          ''
                        )}
                        <NavDropdown.Item
                          onClick={() =>
                            profile
                              ? handleCopyLink(`${profile.username}`)
                              : () => {}
                          }
                        >
                          Copy link
                        </NavDropdown.Item>
                      </NavDropdown>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className='user-content'>
                <Tabs fill>
                  <Tab eventKey='posts' title='Posts' id='is-active'>
                    {profile && profile.current_user_is_blocked ? (
                      <BlockedCard creator={profile.username} />
                    ) : (
                      <InfiniteResourceScroll kwargs={{ username: creator }} Card={ PostCard } />
                    )}
                  </Tab>
                  <Tab eventKey='replies' title='Replies'>
                    {profile && profile.current_user_is_blocked ? (
                      <BlockedCard creator={profile.username} />
                    ) : (
                      <InfiniteResourceScroll
                        kwargs={{ username: creator, is_reply: true }}
                        Card={ PostCard }
                      />
                    )}
                  </Tab>
                  <Tab eventKey='monsters' title='Monsters'>
                    {profile && profile.current_user_is_blocked ? (
                      <BlockedCard creator={profile.username} />
                    ) : (
                      <InfiniteResourceScroll type='monsters' Card={ MonsterCard } label='Monster' />
                    )}
                  </Tab>
                  <Tab eventKey='regions' title='Regions'>
                    {profile && profile.current_user_is_blocked ? (
                      <BlockedCard creator={profile.username} />
                    ) : (
                      "all of user's regions"
                    )}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        ) : (
          <div className='loading-container'>
            <LoadingCard />
          </div>
        )}
      </>
    );
  }
}
