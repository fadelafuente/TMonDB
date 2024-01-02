import TitleBar from "../components/TitleBar";
import { getAllPosts } from "../actions/posts";
import { useEffect } from "react";

export default function Trending() {
    useEffect(() => {
        getAllPosts().then((response) => {
            handlePosts(response.data);
        })
    }, [])

    function handlePosts(res) {
        const post_element = document.getElementById("posts");
        let formatted_posts = "";
        for(let index = 0; index < res.length; index++) {
            for(const key in res[index]) {
                formatted_posts += `<p>${key}: ${res[index][key]}</p>`;
            }
        }

        if(formatted_posts) {
            post_element.innerHTML = formatted_posts;
        } else {
            post_element.innerHTML = "<p>Posts failed to load.</p>"
        }
    }

    return (
        <>
            <TitleBar/>
            <h3>Trending!</h3>
            <div id="posts">
                Loading ...
            </div>
        </>
    )
}
