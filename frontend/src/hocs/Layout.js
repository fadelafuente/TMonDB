import { React, useEffect } from "react";
import { connect } from "react-redux";
import { check_authenticated, load_user } from "../actions/auth";

function Layout({ check_authenticated, load_user, children }) {
    useEffect(() => {
        check_authenticated();
        load_user();
    }, [check_authenticated, load_user]);

    return (
        <div>
            { children }
        </div>
    )
}

export default connect(null, { check_authenticated, load_user })(Layout);