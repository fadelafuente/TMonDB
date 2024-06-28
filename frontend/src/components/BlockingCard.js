import Card from 'react-bootstrap/Card';
import { BsTrash3 } from 'react-icons/bs';

import "../assets/styling/PostCard.css";
import { Button, Col } from 'react-bootstrap';

export function BlockingCard() {
    return (
        <div className="article-container">
            <div className="align-row f-user-row">
                <Col className="follow-username">
                    <button className="svg-btn">@username</button>
                </Col>
                <Col className="align-right">
                    <Button className="rounded-btn profile-btn no-margin-btn">
                        unblock
                    </Button>
                </Col>
            </div>
        </div>
    )
}