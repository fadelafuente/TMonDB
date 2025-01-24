import { BsDot, BsImage } from "react-icons/bs";
import { handleLeadingZeroes } from "../functions/handlers";
import EvoChainTable from "./TableComponents/EvoChainTable";

import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";

export default function EvoChain() {
    const preEvoChain = [
        {name: "Charmander", method: " level 16", national_id: 4, monster_count: 1254, types: ["Fire"]},
        {name: "Charmander", method: "High Friendship: Daytime", national_id: 4, monster_count: 1254, types: ["Fire"]},
        {name: "Charmander", method: " Fire Stone", national_id: 4, monster_count: 1254, types: ["Fire"]},
        {name: "Charmander", method: " Sun Stone", national_id: 4, monster_count: 1254, types: ["Fire"]}
    ];

    const evoChain = [
        {name: "Charizard", method: " level 36", national_id: 6, monster_count: 1254, types: ["Fire", "Flying"]},
        {name: "Charizard", method: "Defeat 3 Bisharp that are holding the Leader's crest.", national_id: 6, monster_count: 1254, types: ["Fire", "Flying"]},
        {name: "Charizard", method: "Collect 999 coins from roaming form", national_id: 6, monster_count: 1254, types: ["Fire", "Flying"]},
        {name: "Charizard", method: " Use Rage Fist 20 times", national_id: 6, monster_count: 1254, types: ["Fire", "Flying"]}
    ];

    return (
        <div className="col-gap-container bottom-barrier">
            <div className="col-gap-container bottom-barrier">
                <h3 className="no-margin-container">Pre-Evolution(s)</h3>
                <div className="max-width-container top-border">
                    <EvoChainTable evoChain = { preEvoChain } />
                </div>
            </div>
            <div className="col-gap-container">
                <h3 className="no-margin-container">Evolution(s)</h3>
                <div className="max-width-container top-border">
                    <EvoChainTable evoChain={ evoChain } />
                </div>
            </div>
        </div>
    )
}