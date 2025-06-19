import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigateNotAuth(isAuthenticated) {
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated === false) {
            return navigate('/login');
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);
}