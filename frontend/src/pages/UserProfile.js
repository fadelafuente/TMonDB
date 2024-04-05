import { React, useState } from "react";
import ProfileInfo from '../components/ProfileInfo';

import '../assets/styling/forms.css';

export default function UserProfile() {
    const [query, setQuery] = useState("");

    return (
        <>
            <ProfileInfo />
        </>
    )
}