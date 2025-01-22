import { useEffect, useRef, useState } from "react";
import { BsDot, BsImage } from "react-icons/bs";


import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";

export default function EvoChain() {
    const preEvoChain = [
        {method: " level 16"},
        {method: " level 16"},
        {method: " level 16"},
        {method: " level 16"},
        {method: " level 16"},
        {method: " level 16"},
        {method: "High Friendship: Nighttime"},
        {method: " Lightning Stone"},
        {method: " Moon Stone"},
        {method: " Sun Stone"}
    ];

    const evoChain = [
        {method: " level 32"},
        {method: " level 36"},
        {method: " level 42"},
        {method: " level 60"},
        {method: "Defeat 3 Bisharp that are holding the Leader's crest."},
        {method: "Collect 999 coins from roaming form"},
        {method: " Use Rage Fist 20 times"}
    ];

    return (
        <div className="col-gap-container bottom-barrier" id="evolution-parent">
            <div className="col-gap-container bottom-barrier">
                <h3 className="no-margin-container">Pre-Evolution(s)</h3>
                <div className="max-width-container top-border">
                    {
                        preEvoChain.map((dict, index) => {
                            return (
                                <div className="row-gap-container evo-card" key={ `${index}-evo` }>
                                    <div className="pfp-image rounded-icon">
                                        <BsImage />
                                    </div>
                                    <div>
                                        <div>
                                            <span>#001 | <strong>Fakemon</strong> | Type1<BsDot />Type2</span>
                                        </div>
                                        <span>{ dict.method }</span>
                                    </div>
                            </div>);
                        })
                    }
                </div>
            </div>
            <div className="col-gap-container">
                <h3 className="no-margin-container">Evolution(s)</h3>
                <div className="max-width-container top-border">
                    {
                        evoChain.map((dict, index) => {
                            return (
                                <div className="row-gap-container evo-card" key={ `${index}-evo` }>
                                    <div className="pfp-image rounded-icon">
                                        <BsImage />
                                    </div>
                                    <div>
                                        <div>
                                            <p>#001 | <strong>Fakemon</strong> | Type1<BsDot />Type2</p>
                                        </div>
                                        <p>{ dict.method }</p>
                                    </div>
                            </div>);
                        })
                    }
                </div>
            </div>
        </div>
    )
}