import { useEffect, useState } from "react";
import { BsCaretDownFill, BsCaretRightFill } from "react-icons/bs";

import "../assets/styling/content.css";
import "../assets/styling/types.css";

export default function TypesTable({ types }) {
    const [typeAdvantages, setTypeAdvantages] = useState({});

    useEffect(() => {
        const advantages = types.reduce(
            (acc1, attacking_type) => {
                  const defending_multipliers = types.reduce((acc2, defending_type) => {
                    acc2[defending_type] = "1.0";
          
                    return acc2;
                  }, []);
                  acc1[attacking_type] = defending_multipliers;
          
                  return acc1;
            }, []);

            setTypeAdvantages(advantages);
    }, [types]);

    function handleChange(multiplier, attacking_type, defending_type) {
        const temp = typeAdvantages;
        temp[attacking_type][defending_type] = multiplier;

        setTypeAdvantages(temp);
    }

    return (
        <>
            <div className="types-table">
                <table>
                    <thead>
                        <th className="types-table-key">
                            <div className="type-key-item">
                                defending <BsCaretRightFill />
                            </div>
                            <div className="type-key-item">
                                attacking <BsCaretDownFill />
                            </div>
                        </th>
                        {
                            Array.from(types, type => (
                                <th>
                                    { type.substring(0, 3) }
                                </th>
                            ))
                        }
                    </thead>
                    <tbody>
                        { 
                            Array.from(types, attacking_type => (
                                <tr>
                                    <th className="attacking-type">
                                        { attacking_type }
                                    </th>
                                    { 
                                        Array.from(types, defending_type => (
                                            attacking_type in typeAdvantages ?
                                                <td>
                                                    <input className="type-input multiplier-input" 
                                                    defaultValue={ typeAdvantages[attacking_type][defending_type] }
                                                    onChange={ e => handleChange(e.target.value, attacking_type, defending_type) } />
                                                </td>
                                            : 
                                                ""
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}