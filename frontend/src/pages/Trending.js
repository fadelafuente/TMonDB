import TitleBar from "../components/TitleBar";
import { getAllPosts } from "../actions/posts";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import "../assets/styling/content.css";

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

    function stickyRelocate() {
        var window_top = document.body.scrollTop;
        var div_top = document.getElementById("sticky-anchor");
        var div_element = document.getElementById("sticky-element");
        console.log(window_top);
        console.log(div_top.offsetHeight);
        if(window_top > div_top.offsetTop) {
            console.log("add");
            div_element.classList.add("sticky");
        } else if(div_element.classList.contains("sticky")) {
            console.log("remove");
            div_element.classList.remove("sticky");
        }
    }

    return (
        <>
            <div className="navbar-container">
                <TitleBar/>
            </div>
            <div className="content-container">
                <div className="aside-container" id="sticky-element">
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
                    Loading ...
                </div>
                <div className="aside-container" id="sticky-element">
                    <div id="sticky-anchor"></div>
                    <div className="content-right">
                        Right
                    </div>
                </div>
            </div>
        </>
    )
}
