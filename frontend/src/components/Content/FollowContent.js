import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';

import { BlockedCard } from '../Cards/BlockedCard';
import FollowList from '../FollowList';
import { useGetProfile } from '../../hooks/hooks';

import '../../assets/styling/PostCard.css';
import '../../assets/styling/UserProfile.css';

export default function FollowContent() {
    const { query } = useOutletContext();
    const { state } = useLocation();
    const { initial_type } = state;
    const { creator } = useParams();
    const [followType, setFollowType] = useState(initial_type);
    const [profile, , , ] = useGetProfile(creator);

    return (
        <>
            <div className='profile-info-container'>
                <div className='user-content'>
                    <Tabs defaultActiveKey={ initial_type } activeKey={ followType } onSelect={ (k) => setFollowType(k) } fill>
                        <Tab eventKey='following' title='Following'>
                            { profile && profile.current_user_is_blocked ?
                                <BlockedCard creator={creator} />
                            :
                                profile ? <FollowList username={profile ? profile.username : null} follow_type='following' query={query} /> : ''
                            }
                        </Tab>
                        <Tab eventKey='followers' title='Followers'>
                            { profile && profile.current_user_is_blocked ?
                                <BlockedCard creator={creator} />
                            :
                                profile ? <FollowList username={profile ? profile.username : null} follow_type='followers' query={query} /> : ''
                            }
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
 
}