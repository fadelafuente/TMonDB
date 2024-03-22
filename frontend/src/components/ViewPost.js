import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { Link } from "react-router-dom";
import { getPostById } from "../actions/posts";
import PostArticle from "./PostArticle";
import ReplyBar from "./ReplyBar";

import "../assets/styling/content.css";
import "../assets/styling/ViewPost.css"
import { DeletedCard } from "./DeletedCard";

export default function ViewPost() {
    const { pid } = useParams();
    const [query, setQuery] = useState("");
    const [post, setPost] = useState("");
    const [parent, setParent] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        getPostById(pid).then((response) => {
            if(response && response.status === 200) {
                setPost(response.data);
                getPostById(response.data["parent"]).then((parent_response) => {
                    if(parent_response && parent_response.status === 200) {
                        setParent(parent_response.data);
                    }
                })
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
                            { post.parent_deleted ?
                                    <div className="parent-container">
                                        <DeletedCard />
                                    </div>
                                :  
                                    parent ? 
                                    <div className="parent-container">
                                        <PostCard post={parent} />
                                    </div>
                                    : ""
                            }
                            <PostCard post={post} />
                            <div className="reply-container">
                                <ReplyBar parent={post.id} />
                            </div>
                            <div className="comments-container">
                                <PostArticle query={query} parent={post.id} />
                            </div>
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