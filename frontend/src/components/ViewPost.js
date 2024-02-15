import { usePaginatedPosts } from "../hooks/hooks";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { Link } from "react-router-dom";

import "../assets/styling/content.css";
import { getPostById } from "../actions/posts";

export default function ViewPost() {
    const { pid } = useParams();
    const [query, setQuery] = useState("");
    // const [posts, lastPost] = usePaginatedPosts(query);
    const [post, setPost] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        getPostById(pid).then((response) => {
            if(response) {
                setPost(response.data);
            }
        }).catch(e => {
            setError(true);
        });
    }, [pid]);

    return (
        <>
            {/* { posts && posts.length !== 0 ? 
                posts.map((post, index) => {
                    if(posts.length === index + 1) {
                        return <div key={post.id} ref={lastPost}><PostCard post={post} /></div>
                    } else {
                        return <div key={post.id}><PostCard post={post} /></div>
                    }
                }) : 
                <PostCard post={null} />
            } */}
            <div className="navbar-container">
                <TitleBar />
            </div>
            <div className="content-container center-content">
                <div className="aside-container left-aside" id="sticky-element">
                    <div id="sticky-anchor"></div>
                    <div className="content-left">
                        <div className="navigation-links">
                            <Link to="/">For You</Link>
                            <Link to="/">Trending</Link>
                            <Link to="/">Monsters</Link>
                            <Link to="/">Regions</Link>
                        </div>
                    </div>
                </div>
                <div id="posts" className="content-center">
                    { post ? 
                        <PostCard post={post} /> : 
                        "Error!!!"
                    }
                </div>
                <div className="aside-container right-aside" id="sticky-element">
                    <div id="sticky-anchor"></div>
                    <div className="content-right">
                        Right
                    </div>
                </div>
            </div>
        </>
    )
}