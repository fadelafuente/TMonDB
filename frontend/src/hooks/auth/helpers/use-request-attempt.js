import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRequestAttempt(accountCreated, errMessage, email, registerAttempt) {
    const navigate = useNavigate();

    useEffect(() => {
        // if register is successful, reset accountCreated in redux store before redirecting
        if(accountCreated && !errMessage) {
            registerAttempt();
            navigate('/verify', { state: { email: email } });
        }
        // eslint-disable-next-line
    }, [accountCreated, errMessage, email, registerAttempt]);
}