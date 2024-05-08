import TitleBar from "../components/TitleBar";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import PostArticle from "../components/PostArticle";
import ProfileInfo from "../components/ProfileInfo";
import ViewPost from "../components/ViewPost";
import { useCurrentUserDetails } from "../hooks/hooks";
import { connect } from "react-redux";
import Account from "../components/Account";
import FollowContent from "../components/FollowContent";

import "../assets/styling/content.css";

function HomePage({ isAuthenticated }) {
    const [query, setQuery] = useState("");
    const [user] = useCurrentUserDetails(isAuthenticated);
    const params = useParams();
    const location = useLocation();

    function handlePath() {
        if(location.pathname === "/home") {
            return (
                <div className="article-container">
                        <PostArticle query={query} />
                </div>
            );
        }
        else if("creator" in params && "pid" in params) {
            if(params["pid"] === "follow") {
                return <FollowContent user={ user } query={ query } />;
            }
            return <ViewPost />;
        } else if("creator" in params) {
            return <ProfileInfo />;
        } else if(location.pathname === "/settings/account") {
            return <Account user={ user } />;
        } else {
            return <ProfileInfo />;
        }
    }

    return (
        <>
            <div className="navbar-container">
                <TitleBar setQuery={(value) => setQuery(value)} user={user} />
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
                            { user ? <Link to={ `/${user.username}` }>Account</Link> : "" }
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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(HomePage);