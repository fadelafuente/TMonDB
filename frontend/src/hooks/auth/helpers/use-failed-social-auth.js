import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useFailedSocialAuth(email) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(!location.state && !email) {
            return navigate('/login');
        }
        // eslint-disable-next-line
    }, [location.state, email]);
}