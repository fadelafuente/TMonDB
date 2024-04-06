import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        });
    }, [pid]);

    return (
        <>
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
                        <PostArticle query={query} kwargs={{parent: post.id}} />
                    </div>
                </div>

                    : 
                "Error!!!"
            }
        </>
    )
}