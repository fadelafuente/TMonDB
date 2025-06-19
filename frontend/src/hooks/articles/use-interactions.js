import { useState } from 'react';

import { updateResourceById } from '../../actions/api';

export function useInteractions(initial_interaction, user_interacted) {
    const [interaction, setInteraction] = useState(initial_interaction);
    const [interacted, setInteracted] = useState(user_interacted);

    function handleUpdateInteractions(e, resource, pid) {
        updateResourceById(resource, pid, {}, e.currentTarget.name).then((response) => {
            if(response && response.status === 200) {
                let change = interacted ? -1 : 1;
                setInteraction(interaction + change);
                setInteracted((prev) => !prev);
            }
        });
    }

    return [interacted, interaction, handleUpdateInteractions];
}