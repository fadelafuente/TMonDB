import { useEffect, useState } from 'react';

import { getFollowByUsername } from '../../actions/auth';
import { handleDuplicatesInArray } from '../../functions/handlers';

export function useUserFollow(username, pageNumber, follow_type, query) {
    const [loading, setLoading] = useState(true);
    const [follow, setFollow] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setFollow([]);
    }, [query]);
    
    useEffect(() => {
        if(hasMore) {
            setLoading(true);
            let query_details = { 'page': pageNumber }
            if(query) query_details['search'] = query

            if (username) {
                getFollowByUsername(username, follow_type, query_details).then((response) => {
                    if(response) {
                        setFollow(prevUsers => {
                            let result = [];
                            result = handleDuplicatesInArray(prevUsers, result);
                            result = handleDuplicatesInArray(response.data.results, result);
                            return result;
                        });
                        setHasMore(response.data.results.length > 0);
                        setLoading(false);
                    }
                }).catch(() => {
                    setFollow([]);
                    setHasMore(false);
                    setLoading(false);
                });
            }
        }

        // eslint-disable-next-line
    }, [query, pageNumber, follow_type])

    return [ loading, follow, hasMore ];
}