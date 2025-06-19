import { useEffect, useState } from 'react';

export function useLoginAttempt(loginFailed, isAuthenticated, loginAttempt) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if(loginFailed && !isAuthenticated) {
            setShow(true);
        }
    }, [loginFailed, isAuthenticated]);

    function resetLoginAttempt() {
        loginAttempt();
        setShow(false);
    }

    return [show, resetLoginAttempt];
}