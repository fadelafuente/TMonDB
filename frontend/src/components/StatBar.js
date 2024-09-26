import { useEffect, useState } from "react";

import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";

export default function StatBar({ stat, stats, total }) {
    const RANGE_CHART = {
        0: "range-bottom-color",
        1: "range-bottom-color",
        2: "range-below-color",
        3: "range-mid-color",
        4: "range-above-color",
        5: "range-top-color"
    }

    useEffect(() => {
        const width = 100 * stats[stat] / ((total / 3));
        const elements = document.getElementsByClassName(`${stat}-bar`)[0];

        const range = Math.min(Math.ceil(width / 20), 5);

        elements.style.width = width + "%";
        elements.style.backgroundColor = "var(--" + RANGE_CHART[range] + ")";
    }, [stat]);

    return (
        <div className={ `stat-bar ${stat}-bar` }></div>
    )
}