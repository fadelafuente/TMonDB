import { Card, Spinner } from 'react-bootstrap';

export default function LoadingCard() {
    return (
        <Card>
            <Card.Body className='centered-icon'>
                <Spinner animation='border' role='status' className='spinner'>
                    <span className='visually-hidden'>Loading...</span>
                </Spinner>
            </Card.Body>
            <Card.Footer>
                <p className='centered-card-text'>
                    Loading content...
                </p>
            </Card.Footer>
        </Card>
    );
}