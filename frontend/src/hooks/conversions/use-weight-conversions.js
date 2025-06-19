import { useState } from 'react';
import { handleLbToKgConversion, handleKgToLbConversion } from '../../functions/handlers';

export function useWeightConversions(initialLb) {
    const [weightLb, setWeightLb] = useState(initialLb);

    function handleLbInput(e, setFormData) {
        const value = e.target.value ? e.target.value : '0';
        if(value.match('^[0-9]*(.[0-9]{0,1}){0,1}$')) {
            const lb = value === '' ? 0 : value;
            if(parseFloat(lb) <= 2204.8) {
                const kg = handleLbToKgConversion(lb);
                setWeightLb(lb > 0 ? lb : '');
                const kgInput = document.getElementById('average-weight-input');
                kgInput.value = kg;
                setFormData({target: kgInput});
            }
        }
    }

    function handleKgInput(e, setFormData) {
        const value = e.target.value;
        if(value.match('^[0-9]*(.[0-9]{0,2}){0,1}$')) {
            const kg = value === '' ? 0 : value;
            if(parseFloat(kg) <= 999.9) {
                const lb = handleKgToLbConversion(kg);
                setWeightLb(lb > 0 ? lb : '');
                setFormData(e);
            }
        }
    }

    return [weightLb, handleLbInput, handleKgInput];
}