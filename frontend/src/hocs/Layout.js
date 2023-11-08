import { React, useEffect } from "react";
import { connect } from "react-redux";
import { check_authenticated, load_user, google_authenticate } from "../actions/auth";
import { useLocation } from "react-router-dom";

function Layout({ check_authenticated, load_user, children, google_authenticate }) {
    let location = useLocation();

    useEffect(() => {
        const values = new URLSearchParams(location.search);
        const state = values.state ? values.state : null;
        const code = values.code ? values.code : null;

        console.log('State: ' + state);
        console.log('Code: ' + code);

        if(state && code) {
            google_authenticate(state, code)
        } else {
            check_authenticated();
            load_user();
        }
    }, [check_authenticated, load_user, google_authenticate, location]);

    return (
        <div>
            { children }
        </div>
    )
}

export default connect(null, { check_authenticated, load_user, google_authenticate })(Layout);