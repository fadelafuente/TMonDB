import { useParams } from 'react-router-dom';
import { Tab, Tabs } from 'react-bootstrap';
import { useGetProfile } from '../hooks/hooks';

import "../assets/styling/PostCard.css";
import "../assets/styling/UserProfile.css";
import { useState } from 'react';
import FollowList from './FollowList';

export default function FollowContent({ query }) {
    const { creator } = useParams();
    const [followType, setFollowType] = useState("following");
    const [profile, , , ] = useGetProfile(creator);

    return (
        <>
            <div className="profile-info-container">
                <div className="user-content">
                    <Tabs fill>
                        <Tab eventKey="Following" title="Following" onClick={ () => setFollowType("following") }>
                            <FollowList uid={profile ? profile.id : null} follow_type={followType} query={query} />
                        </Tab>
                        <Tab eventKey="Followers" title="Followers" onClick={ () => setFollowType("followers") }>
                            following
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
 
}