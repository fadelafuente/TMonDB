import TitleBar from "../components/TitleBar";
import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import useGetPosts from "../hooks/hooks";

import "../assets/styling/content.css";
import PostCard from "../components/PostCard";

export default function Trending() {
    const [query, setQuery] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, error, posts, hasMore } = useGetPosts(query, pageNumber);
    const observer = useRef();
    const lastPost = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node);
    }, [loading, hasMore]);

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
                <div id="posts" className="content-center center-content">
                    { posts && posts.length !== 0 ? 
                        posts.map((post, index) => {
                            if(posts.length === index + 1) {
                                return <div key={post.id} ref={lastPost}><PostCard post={post} /></div>
                            } else {
                                return <div key={post.id}><PostCard post={post} /></div>
                            }
                        }) : 
                        <PostCard post={null} />
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
