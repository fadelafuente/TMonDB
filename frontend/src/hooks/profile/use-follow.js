import { useState } from 'react';
import { followUser } from '../../actions/auth';

export function useFollow(initial_interaction, user_interacted) {
    const [interaction, setInteraction] = useState(initial_interaction);
    const [interacted, setInteracted] = useState(user_interacted);

    function handleFollowUser(username) {
        followUser(username).then((response) => {
            if(response && response.status === 200) {
                let change = interacted ? -1 : 1;
                setInteraction(interaction + change);
                setInteracted((prev) => !prev);
            }
        });
    }

    function handleFollowHelper(value, interacted=null) {
        if(typeof interacted === 'boolean') {
            setInteraction(value);
            setInteracted(interacted);   
        } else {
            handleFollowUser(value);
        }
    }

    return [interacted, interaction, handleFollowHelper];
}