import { React, useEffect } from "react";
import { connect } from "react-redux";
import { checkAuthenticated, loadUser } from "../actions/auth";

function Layout({ checkAuthenticated, loadUser, children }) {
    useEffect(() => {
        checkAuthenticated();
        loadUser();
    }, [checkAuthenticated, loadUser]);

    return (
        <div>
            { children }
        </div>
    )
}

export default connect(null, { checkAuthenticated, loadUser })(Layout);