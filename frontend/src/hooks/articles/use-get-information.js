import { useEffect, useState } from 'react';
import { handleDuplicatesInArray } from '../../functions/handlers';

export function useGetInformation(pageNumber, query, getFunc, resource, kwargs={}) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setItems([]);
    }, [query]);
    
    useEffect(() => {
        setLoading(true);
        let query_details = {'page': pageNumber, ...kwargs};
        if(query) query_details['search'] = query;

        getFunc(resource, query_details).then((response) => {
            if(response) {
                setItems(prevPosts => {
                    let result = [];
                    result = handleDuplicatesInArray(prevPosts, result);
                    result = handleDuplicatesInArray(response.data.results, result);
                    return result;
                });
                setHasMore(response.data.results.length > 0);
                setLoading(false);
            }
        }).catch(() => {
            setItems([]);
            setHasMore(false);
            setLoading(false);
        });

        // eslint-disable-next-line
    }, [query, pageNumber])

    return { loading, items, hasMore };
}