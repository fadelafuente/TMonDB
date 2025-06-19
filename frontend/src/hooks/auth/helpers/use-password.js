import { useState } from 'react';

export function usePassword() {
    const [showPass, setShowPass] = useState(false);

    function handleShowPass(id) {
        const password_input = document.getElementById(id);
        setShowPass((prev) => !prev);
        const type = showPass ? 'password' : 'text';
        password_input.setAttribute('type', type);
    }

    return [showPass, handleShowPass];
}