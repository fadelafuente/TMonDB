import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigateOnAuth(isAuthenticated) {
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated) {
            return navigate('/');
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);
}