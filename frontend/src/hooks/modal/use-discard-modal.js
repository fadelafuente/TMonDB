import { useState } from 'react';

export function useDiscardModal(formData, setShow) {
    const [showDiscard, setShowDiscard] = useState(false);

    function handleDiscard(e, setFormData=null) {
        if(setFormData === null) {
            const { content } = formData;
            if(!content) {
                setShow(false);
            } else {
                setShowDiscard(true);
            }
        } else if(typeof setFormData === 'boolean') {
            setShowDiscard(setFormData);
        } else if(typeof setFormData === 'function') {
            setFormData(e, true);
            setShowDiscard(false);
            setShow(false);
        }
    }

    return [showDiscard, handleDiscard];
}