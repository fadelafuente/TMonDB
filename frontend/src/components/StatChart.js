import { useState } from "react";

import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";
import StatBar from "./StatBar";

export default function StatChart() {
    const [stats, setStats] = useState({
        HP: 150,
        STA: 70,
        SPD: 10,
        ATK: 100,
        DEF: 44,
        SPATK: 30,
        SPDEF: 54,
        total: 458 
    });

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
                                <td className="stat-number" key={ `${ stat }-amount` }>
                                    { stats[stat] }
                                </td>
                                {
                                    stat !== "total" ?
                                        <td className="stat-bar-container" key={ `${ stat }-bar` }>
                                            <StatBar stat={ stat } stats={ stats } total={ stats["total"] } />
                                        </td>
                                    :
                                        ""
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}