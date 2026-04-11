import { useEffect, useCallback, useState, useRef } from 'react';
import { useGetInformation } from './use-get-information';

export function usePagination(query, getFunc, resource, kwargs) {
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, items, hasMore } = useGetInformation(pageNumber, query, getFunc, resource, kwargs);
    const observer = useRef();

    useEffect(() => {
        setPageNumber(1);
    }, [query])

    const lastItem = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

    return [items, lastItem];
}