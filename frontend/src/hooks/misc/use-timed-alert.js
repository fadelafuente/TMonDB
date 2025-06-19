import { useEffect, useState } from 'react';

export function useTimedAlert(initial_state) {
    if(typeof initial_state !== 'boolean') initial_state = false;
    const [showAlert, setShowAlert] = useState(initial_state);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShowAlert(false);
        }, 5000)

        return () => {
            clearTimeout(timeId);
        }
        // eslint-disable-next-line
    }, [showAlert])

    return [showAlert, setShowAlert];
}