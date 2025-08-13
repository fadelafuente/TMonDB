import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocialLogin } from '../features/user/auth/use-social-login';

export function useSocialAuth(provider) {
  const location = useLocation();
  const { mutate: socialAuthenticate } = useSocialLogin();

  useEffect(() => {
    const values = new URLSearchParams(location.search);
    const state = values.has('state') ? values.get('state') : null;
    const code = values.has('code') ? values.get('code') : null;

    if (state && code) {
      socialAuthenticate({ state, code, provider });
    }
  }, [provider, location, socialAuthenticate]);
}