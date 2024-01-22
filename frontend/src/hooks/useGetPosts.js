import { useEffect, useState } from "react";
import { getAllPosts } from "../actions/posts";

export default function useGetPosts(query, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setPosts([]);
    }, [query])

    function handleDuplicatesInArray(source, result) {
        if(!source) return [];
        let id_set = new Set(result.map(item => {return item.id}));
        source.forEach(item => {
            if(!id_set.has(item.id)) {
                id_set.add(item.id);
                result.push(item);
            }
        });

        return result;
    }
    
    useEffect(() => {
        setLoading(true);
        setError(false);
        getAllPosts(query, pageNumber).then((response) => {
            if(response) {
                setPosts(prevPosts => {
                    let result = [];
                    result = handleDuplicatesInArray(prevPosts, result);
                    result = handleDuplicatesInArray(response.data.results, result);
                    return result;
                })
                setHasMore(response.data.results.length > 0);
                setLoading(false);
            }
        }).catch(e => {
            setError(true);
        });
    }, [query, pageNumber])

    return { loading, error, posts, hasMore };
}