import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRequestSent(requestSent) {
    const navigate = useNavigate();

    useEffect(() => {
        if(requestSent) {
            return navigate('/login');
        }
        // eslint-disable-next-line
    }, [requestSent]);
}