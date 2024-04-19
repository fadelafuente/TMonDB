import TitleBar from "../components/TitleBar";
import { Link } from "react-router-dom";
import { useState } from "react";
import PostArticle from "../components/PostArticle";
import ProfileInfo from "../components/ProfileInfo";
import ViewPost from "../components/ViewPost";

import "../assets/styling/content.css";
import Account from "./Account";

export default function HomePage({ accessedContent }) {
    const [query, setQuery] = useState("");

    function handlePath() {
        if(accessedContent === "home") {
            return (
                <div className="article-container">
                        <PostArticle query={query} />
                </div>
            );
        } else if(accessedContent === "user") {
            return <ProfileInfo />;
        } else if(accessedContent === "account") {
            return <Account />
        } else if(accessedContent === "post") {
            return <ViewPost />;
        }
    }

    return (
        <>
            <div className="navbar-container">
                <TitleBar setQuery={(value) => setQuery(value)} />
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
                    { handlePath() }
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
