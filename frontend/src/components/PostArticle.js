import { usePaginatedPosts } from "../hooks/hooks";
import PostCard from "./PostCard";

import "../assets/styling/content.css";

export default function PostArticle({query, parent=null}) {
    const [posts, lastPost] = usePaginatedPosts(query, parent);

    return (
        <>
            { posts && posts.length !== 0 ? 
                posts.map((post, index) => {
                    if(posts.length === index + 1) {
                        return <div key={post.id} ref={lastPost}><PostCard post={post} /></div>
                    } else {
                        return <div key={post.id}><PostCard post={post} /></div>
                    }
                }) : parent ? "" : "loading..."
            }
        </>
    )
}