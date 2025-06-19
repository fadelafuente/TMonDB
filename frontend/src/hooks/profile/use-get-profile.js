import { useEffect, useState } from 'react';

import { getUserProfile } from '../../actions/auth';
import { useFollow } from './use-follow';

export function useGetProfile(username) {
    const [profile, setProfile] = useState(null);
    const [followed, follows, setFollow] = useFollow(0, false);

    useEffect(() => {
        getUserProfile(username).then((response) => {
            if(response && response.status === 200) {
                setProfile(response.data);
                setFollow(response.data['followers_count'], response.data['user_follows']);
            }
        }).catch(() => {
            setProfile(null);
        });
        
        // eslint-disable-next-line
    }, [username]);

    return [profile, followed, follows, setFollow];
}