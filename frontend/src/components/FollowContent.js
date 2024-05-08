import { useParams } from 'react-router-dom';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import useGetPosts, { useGetProfile, usePaginatedPosts, usePaginatedUserFollow } from '../hooks/hooks';

import "../assets/styling/PostCard.css";
import "../assets/styling/UserProfile.css";
import FollowCard from './FollowCard';
import { useEffect, useState } from 'react';

export default function FollowContent({ user, query }) {
    const [followType, setFollowType] = useState("following");
    const [uid, setUid] = useState(user ? user.id : null);
    const [users, loading, lastUser] = usePaginatedUserFollow(uid, query, followType);

    useEffect(() => {
        if(user && uid === null)
            setUid(user.id);
    }, [user, uid]);

    console.log(users);

    return (
        <>
            <div className="profile-info-container">
                <div className="user-content">
                    <Tabs fill>
                        <Tab eventKey="Following" title="Following" onClick={ () => setFollowType("following") }>
                            <FollowCard />
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