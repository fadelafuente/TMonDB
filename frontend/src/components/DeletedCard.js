import Card from 'react-bootstrap/Card';
import { BsTrash3 } from 'react-icons/bs';

import "../assets/styling/PostCard.css";

export function DeletedCard() {
    return (
        <Card>
            <Card.Body className='deleted-icon'>
                <BsTrash3/>
            </Card.Body>
            <Card.Footer className='deleted-text'>
                Post has been deleted.
            </Card.Footer>
        </Card>
    )
}