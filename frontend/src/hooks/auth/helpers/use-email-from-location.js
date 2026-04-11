import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useEmailFromLocation() {
    const [email, setEmail] = useState('');
    const location = useLocation();

    useEffect (() => {
        if(location.state) {
            setEmail(location.state.email);
        }
        // eslint-disable-next-line
    }, [location.state]);

    return email;
}