import Card from 'react-bootstrap/Card';
import { BsXCircle } from 'react-icons/bs';

import "../assets/styling/PostCard.css";

export function FailedCard() {
    return (
        <Card>
            <Card.Body className='deleted-icon'>
                <BsXCircle/>
            </Card.Body>
            <Card.Footer className='deleted-text'>
                Post(s) failed to load.
            </Card.Footer>
        </Card>
    )
}