import { useState } from 'react';
import { handleHeightConversion } from '../../functions/handlers';

export function useHeightConversions(initialFt, initialIn) {
    const [heightFt, setHeightFt] = useState(initialFt);
    const [heightIn, setHeightIn] = useState(initialIn);

    function handleFtInput(e, setFormData) {
        const value = e.target.value;
        if(value.match('^[0-9]*$')) {
            const feet = value === '' ? 0 : parseInt(value);
            if(feet <= 32) {
                const m = handleHeightConversion(feet, heightIn ? parseFloat(heightIn) : 0);
                if (m <= 999.9) {
                    setHeightFt(feet > 0 ? feet : '');
                    const mInput = document.getElementById('average-height-input');
                    mInput.value = m;
                    setFormData({target: mInput});
                }
            }
        }
    }

    function handleInInput(e, setFormData) {
        const value = e.target.value;
        if(value.match('^[0-9]*(.[0-9]{0,1}){0,1}$')) {
            const inches = value === '' ? 0 : value;
            if(inches < 12) {
                const m = handleHeightConversion(heightFt ? parseInt(heightFt) : 0, inches);
                if (m <= 999.9) {
                    setHeightIn(inches > 0 ? inches : '');
                    const mInput = document.getElementById('average-height-input');
                    mInput.value = m;
                    setFormData({target: mInput});
                }
            }
        }
    }

    function handleMInput(e, setFormData) {
        const value = e.target.value;
        if(e.target.value.match('^[0-9]*(.[0-9]{0,1}){0,1}$')) {
            const m = value === '' ? 0 : value;
            if(parseFloat(m) <= 999.9) {
                const [feet, inches] = handleHeightConversion(m);
                setHeightFt(feet > 0 ? feet : '');
                setHeightIn(inches > 0 ? inches : '');
                setFormData(e);
            }
        }
    }

    return [heightFt, handleFtInput, heightIn, handleInInput, handleMInput];
}