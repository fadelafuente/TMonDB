import { usePaginatedPosts } from "../hooks/hooks";
import PostCard from "./PostCard";
import Spinner from 'react-bootstrap/Spinner';
import { FailedCard } from "./FailedCard";

import "../assets/styling/content.css";
import { useEffect, useState } from "react";

export default function PostArticle({query, kwargs={}}) {
    const [loading, setLoading] = useState(true);
    const [posts, lastPost] = usePaginatedPosts(query, kwargs);

    useEffect(() => {
       setLoading(true);
       if(posts) setLoading(false); 
    }, [posts]);

    return (
        <>
            {   
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
            {
                loading ? 
                    <div className="loading-container center-content">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    ""
            }
        </>
    )
}