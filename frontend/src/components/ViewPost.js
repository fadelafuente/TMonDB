import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { Link } from "react-router-dom";

import "../assets/styling/content.css";
import { getPostById } from "../actions/posts";
import PostArticle from "./PostArticle";

export default function ViewPost() {
    const { pid } = useParams();
    const [query, setQuery] = useState("");
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
                    { post ? 
                        <div>
                            <PostCard post={post} />
                            <PostArticle query={query} parent={post.id} />
                        </div>

                         : 
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