import TitleBar from "../components/TitleBar";
import { getPostById } from "../actions/posts";
import { useEffect, useState } from "react";

export default function Trending() {
    const [post, setPost] = useState({});
    useEffect(() => {
        getPostById(1).then((response) => {
            setPost(response.data);
        })
    }, [])

    return (
        <>
            <TitleBar/>
            <h3>Trending!</h3>
            <div>
                { 
                    Object.keys(post).map((key, value) => (
                        <p key={key} value={value}> {key}: {post[key]}</p>
                    )) 
                }
            </div>
        </>
    )
}
