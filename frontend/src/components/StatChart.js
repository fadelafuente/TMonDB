import { useState } from "react";

import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";

export default function StatChart() {
    const [total, setTotal] = useState(454);
    const [stats, setStats] = useState({
        HP: 70,
        STA: 65,
        SPD: 85,
        ATK: 83,
        DEF: 54,
        SPATK: 43,
        SPDEF: 54    
    });

    function handleEffectiveColor(s) {
        const EFFECTIVE_CHART = {
            4: "weakness-ultra",
            2: "weakness-super",
            1: "weakness-effective",
            0.5: "weakness-sub",
            0.25: "weakness-nominally",
            0: "weakness-noeffect"
        }

        const multiplier = stats[s];

        return "stat-number";
    }

    return (
        <div className="stat-chart bottom-barrier">
            <table>
                <tbody>
                    {
                        Array.from(Object.keys(stats), stat => (
                            <tr className="stat-row">
                                <th key={ stat } className="stat-header">
                                    { stat }
                                </th>
                                <td className={ handleEffectiveColor(stat) } key={ `${ stat }-amount` }>
                                    { stats[stat] }
                                </td>
                                <td className="stat-bar-container">
                                    <div style={{ width: 100 * stats[stat] / ((total / 3)) + "%", backgroundColor: "green", height: 1 + "em" }}></div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}