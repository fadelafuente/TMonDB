import { useParams } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';
import { useGetProfile } from '../hooks/hooks';

import "../assets/styling/PostCard.css";
import "../assets/styling/UserProfile.css";

export default function FollowCard({ uid }) {
    const { creator } = useParams();
    const [profile, followed, follows, setFollow] = useGetProfile(creator);

    return (
        <>
            <div className="align-row">
                <div className="pfp-image">
                    pfp
                </div>
                <div className="f-user-details">
                    <div className="align-row f-user-row">
                        <Col>
                            @username
                        </Col>
                        <Col className="align-right">
                            <Button className="rounded-btn profile-btn" onClick={() => setFollow(profile.id)}>
                                { followed ? "Unfollow" : "Follow" } 
                            </Button>
                        </Col>
                    </div>
                    <div>
                        bio
                    </div>
                </div>
            </div>
        </>
    )
 
}