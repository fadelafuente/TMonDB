import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { FailedCard } from '../Cards/FailedCard';
import LoadingCard from '../Cards/LoadingCard';
import PostCard from '../Cards/PostCard';
import { getAllResources } from '../../actions/api';
import { usePagination } from '../../hooks/articles/use-pagination';

import '../../assets/styling/content.css';

export default function PostArticles({kwargs={}}) {
    const { query } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [posts, lastPost] = usePagination(query, getAllResources, 'posts', kwargs);

    useEffect(() => {
       setLoading(true);
       if(posts) setLoading(false); 
    }, [posts]);

    return (
        <>
            {
                loading ? 
                    <div className='article-container'>
                        <LoadingCard />
                    </div>
                :
                    posts ? 
                        posts.map((post, index) => {
                            if(posts.length === index + 1) {
                                return <div key={post.id} ref={lastPost}><PostCard post={post} /></div>
                            } else {
                                return <div key={post.id}><PostCard post={post} /></div>
                            }
                        })
                    :
                        <FailedCard />
            }
        </>
    )
}