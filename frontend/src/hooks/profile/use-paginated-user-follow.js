import { useEffect, useCallback, useState, useRef } from 'react';
import { useUserFollow } from './use-user-follow';

export function usePaginatedUserFollow(username, follow_type, query) {
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, users, hasMore] = useUserFollow(username, pageNumber, follow_type, query);
    const observer = useRef();

    useEffect(() => {
        setPageNumber(1);
    }, [query, follow_type])

    const lastUser = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

    return [users, lastUser];
}