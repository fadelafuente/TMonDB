import { Card, Spinner } from 'react-bootstrap';

export default function LoadingCard() {
    return (
        <Spinner animation='border' role='status' className='spinner'>
            <span className='visually-hidden'>Loading...</span>
        </Spinner>
    );
}