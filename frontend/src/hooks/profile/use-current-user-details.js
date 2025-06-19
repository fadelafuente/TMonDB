import { useEffect, useState } from 'react';

import { getCurrentUserDetails } from '../../actions/auth';

export function useCurrentUserDetails(isAuthenticated) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUserDetails().then((response) => {
            if(response && response.status === 200) {
                setUser(response.data);
            }
        });
    }, [isAuthenticated]);

    return [user];
}