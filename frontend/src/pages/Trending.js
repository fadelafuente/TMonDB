import TitleBar from "../components/TitleBar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePaginatedPosts } from "../hooks/hooks";

import "../assets/styling/content.css";
import PostCard from "../components/PostCard";

export default function Trending() {
    const [query, setQuery] = useState("");
    const [posts, lastPost] = usePaginatedPosts(query);

    return (
        <>
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
                    { posts && posts.length !== 0 ? 
                        posts.map((post, index) => {
                            if(posts.length === index + 1) {
                                return <div key={post.id} ref={lastPost}><PostCard post={post} /></div>
                            } else {
                                return <div key={post.id}><PostCard post={post} /></div>
                            }
                        }) : 
                        "Failed to load :("
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
