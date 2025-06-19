import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigateOnVerify(verified) {
    const navigate = useNavigate();

    useEffect(() => {
        if(verified) {
            return navigate('/login');
        }
        // eslint-disable-next-line
    }, [verified]);
}