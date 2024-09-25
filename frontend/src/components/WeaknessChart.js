import { useState } from "react";

import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";

export default function WeaknessChart() {
    const [weaknesses, setWeaknesses] = useState({
        fire: 2.0,
        water: 1.0,
        grass: 0.5,
        ground: 2.0,
        rock: 2.0,
        ice: 1.0,
        dragon: 1.0,
        fairy: 4.0,
        fighting: 0,
        poison: 1.0,
        dark: 1.0,
        ghost: 0.25,
        psychic: 1.0,
        steel: 0.25,
        bug: 1.0,
        flying: 1.0,
        normal: 4.0,
        electric: 0.5
    });

    function handleEffectiveColor(t) {
        const EFFECTIVE_CHART = {
            4: "weakness-ultra",
            2: "weakness-super",
            1: "weakness-effective",
            0.5: "weakness-sub",
            0.25: "weakness-nominally",
            0: "weakness-noeffect"
        }

        const multiplier = weaknesses[t];

        return `weakness-chart-cell-spacing ${EFFECTIVE_CHART[multiplier]}`;
    }

    return (
        <div className="weakness-chart bottom-barrier">
            <table>
                <thead>
                    {
                        Array.from(Object.keys(weaknesses), attacking_type => (
                            <th className="weakness-chart-cell-spacing" key={ attacking_type }>
                                { attacking_type.substring(0, 3) }
                            </th>
                        ))
                    }
                </thead>
                <tbody>
                    <tr>
                        {
                            Array.from(Object.keys(weaknesses), attacking_type => (
                                <td className={ handleEffectiveColor(attacking_type) } key={ `${attacking_type}-multiplier` }>
                                    { weaknesses[attacking_type] }
                                </td>
                            ))
                        }
                    </tr>
                </tbody>
            </table>
        </div>
    )
}