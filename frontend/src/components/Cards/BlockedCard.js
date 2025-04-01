import { BsSlashCircle } from 'react-icons/bs';

import Card from 'react-bootstrap/Card';

import '../../assets/styling/PostCard.css';

export function BlockedCard({creator='Anonymous'}) {
    return (
        <Card>
            <Card.Body className='deleted-icon'>
                <BsSlashCircle/>
            </Card.Body>
            <Card.Footer>
                <h4 className='centered-card-text'>You're blocked.</h4>
                <p className='centered-card-text'>
                    You cannot follow or view @{creator}'s posts.
                </p>
            </Card.Footer>
        </Card>
    )
}