import { usePagination } from "../hooks/hooks";
import PostCard from "./Cards/PostCard";
import Spinner from 'react-bootstrap/Spinner';
import { FailedCard } from "./Cards/FailedCard";
import { useEffect, useState } from "react";
import { getAllPosts } from "../actions/posts";

import "../assets/styling/content.css";

export default function PostArticle({query, kwargs={}}) {
    const [loading, setLoading] = useState(true);
    const [posts, lastPost] = usePagination(query, getAllPosts, kwargs);

    useEffect(() => {
       setLoading(true);
       if(posts) setLoading(false); 
    }, [posts]);

    return (
        <>
            {
                loading ? 
                    <div className="loading-container center-content">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                :
                    posts ? 
                        posts.map((post, index) => {
                            if(posts.length === index + 1) {
                                return <div key={post.id} ref={lastPost}><PostCard post={post} /></div>
                            } else {
                                return <div key={post.id}><PostCard post={post} /></div>
                            }
                        }) : kwargs["parent"] ? "" 
                    :
                        <FailedCard />
            }
        </>
    )
}