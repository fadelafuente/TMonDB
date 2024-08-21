import { useLocation, useParams } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import { useGetProfile } from '../hooks/hooks';
import { useState } from 'react';
import FollowList from './FollowList';
import { BlockedCard } from './Cards/BlockedCard';

import "../assets/styling/PostCard.css";
import "../assets/styling/UserProfile.css";

export default function FollowContent({ query }) {
    const { state } = useLocation();
    const { initial_type } = state;
    const { creator } = useParams();
    const [followType, setFollowType] = useState(initial_type);
    const [profile, , , ] = useGetProfile(creator);

    return (
        <>
            <div className="profile-info-container">
                <div className="user-content">
                    <Tabs defaultActiveKey={initial_type} activeKey={followType} onSelect={(k) => setFollowType(k)} fill>
                        <Tab eventKey="following" title="Following" onClick={(k) => setFollowType(k)}>
                            { profile && profile.blocked_current_user ?
                                <BlockedCard creator={creator} />
                            :
                                <FollowList uid={profile ? profile.id : null} follow_type="following" query={query} />
                            }
                        </Tab>
                        <Tab eventKey="followers" title="Followers" onClick={(k) => setFollowType(k)}>
                            { profile && profile.blocked_current_user ?
                                <BlockedCard creator={creator} />
                            :
                                <FollowList uid={profile ? profile.id : null} follow_type="followers" query={query} />
                            }
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
 
}