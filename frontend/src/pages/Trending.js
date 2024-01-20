import TitleBar from "../components/TitleBar";
import { getAllPosts } from "../actions/posts";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { handlePosts } from "../functions/handlers";

import "../assets/styling/content.css";
import PostCard from "../components/PostCard";

export default function Trending() {
    useEffect(() => {
        getAllPosts().then((response) => {
            if(response) {
                handlePosts(response.data);
            } else {
                const post_element = document.getElementById("posts");
                post_element.innerHTML = "<p>Posts failed to load.</p>";
            }
        })
    }, [])

    return (
        <>
            <div className="navbar-container">
                <TitleBar />
            </div>
            <div className="content-container">
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
                    <PostCard post={null} />
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
