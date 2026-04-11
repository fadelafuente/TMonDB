import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export function useNavigateNotAuth() {
    const { isAuthenticated } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated) {
            return navigate('/login');
        }
        // eslint-disable-next-line
    }, [isAuthenticated]);
}