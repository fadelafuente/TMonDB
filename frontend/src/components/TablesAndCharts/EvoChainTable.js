import { BsDot, BsImage } from "react-icons/bs";
import { handleLeadingZeroes } from "../../functions/handlers";

import "../../assets/styling/content.css";
import "../../assets/styling/UserProfile.css";
import "../../assets/styling/MonCard.css";

export default function EvoChainTable({ evoChain }) {
    return (
        <>
            {
                evoChain.map((dict, index) => {
                    return (
                        <div className="row-gap-container evo-card" key={ `${index}-evo` }>
                            <div className="pfp-image rounded-icon">
                                <BsImage />
                            </div>
                            <div>
                                <div>
                                    <span>#{ handleLeadingZeroes(dict.national_id, dict.monster_count) } | <strong>{ dict.name }</strong> | { dict.types[0] }
                                        { dict.types.length === 2 ? <><BsDot />{ dict.types[1] }</> : "" }
                                    </span>
                                </div>
                                <span>{ dict.method }</span>
                            </div>
                    </div>);
                })
            }
        </>
    )
}