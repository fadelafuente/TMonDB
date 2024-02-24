import { usePaginatedPosts } from "../hooks/hooks";
import PostCard from "../components/PostCard";
import { useState } from "react";

import "../assets/styling/content.css";

export default function CreatePost() {
    const [query, setQuery] = useState("");
    const [posts, lastPost] = usePaginatedPosts(query);

    return (
        <>
            { posts && posts.length !== 0 ? 
                posts.map((post, index) => {
                    if(posts.length === index + 1) {
                        return <div key={post.id} ref={lastPost}><PostCard post={post} /></div>
                    } else {
                        return <div key={post.id}><PostCard post={post} /></div>
                    }
                }) : 
                "loading..."
            }
        </>
    )
}