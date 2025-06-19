import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSocialAuth(provider, socialAuthenticate) {
    const location = useLocation();

    useEffect(() => {
        const values = new URLSearchParams(location.search);
        const state = values.has('state') ? values.get('state') : null;
        const code = values.has('code') ? values.get('code') : null;

        if (state && code) {
            socialAuthenticate(state, code, provider);
        }
    }, [provider, location, socialAuthenticate]);
}