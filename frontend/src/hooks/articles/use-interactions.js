import { useState } from 'react';

import { useUpdateInteraction } from '../features/api/use-update-interaction';

export function useInteractions(initial_interaction, user_interacted, resource = 'posts') {
  const [interaction, setInteraction] = useState(initial_interaction);
  const [interacted, setInteracted] = useState(user_interacted);
  const { mutate } = useUpdateInteraction(resource);

  function handleUpdateInteractions(e, id) {
    const interaction_type = e.currentTarget.name;
    mutate({ interaction_type, id }, {
      onSuccess: () => {
        let change = interacted ? -1 : 1;
        setInteraction(interaction + change);
        setInteracted((prev) => !prev);
      },
    });
  }

  return [interacted, interaction, handleUpdateInteractions];
}