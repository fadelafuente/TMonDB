import { useEffect, useCallback, useState } from 'react';

export function useRegisterAttempt(errMessage, isAuthenticated, registerAttempt) {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    const errorMessageCallback = useCallback(() => {
        if(typeof errMessage == 'string') {
            const element = new DOMParser().parseFromString(errMessage, 'text/html').getElementsByClassName('exception_value');
            const err_message = element[0].innerHTML.replace(/['']+/g, '');
            setMessage(err_message);
        } else if(typeof errMessage == 'object' && 'email' in errMessage) {
            const err_message = errMessage['email'][0];
            setMessage(err_message);
        } else if(typeof errMessage == 'object' && 'username' in errMessage) {
            let err_message = errMessage['username'][0];
            err_message = err_message.charAt(0).toUpperCase() + err_message.slice(1);
            setMessage(err_message);
        } else {
            setMessage('');   
        }
    }, [errMessage]);

    useEffect(() => {
        if(errMessage && !isAuthenticated) {
            setShow(true);
            errorMessageCallback();
        }
    }, [errMessage, isAuthenticated, errorMessageCallback]);

    function resetRegisterAttempt() {
        registerAttempt();
        setShow(false);
    }

    return [show, resetRegisterAttempt, message];
}