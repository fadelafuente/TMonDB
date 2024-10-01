import { useState } from "react";

import "../assets/styling/content.css";
import "../assets/styling/UserProfile.css";
import "../assets/styling/ViewMon.css";

export default function ExploreButtons({ parentBtn, setParentBtn, btns=[] }) {
    const [activeBtn, setActiveBtn] = useState(parentBtn);

    function handleChangeSubSection(e) {
        setActiveBtn(e.target.name);
        setParentBtn(e.target.name);
    }

    console.log(parentBtn);

    return (
        <div className="view-explore-btns bottom-barrier">
            {
                btns.map((currentBtn) => {
                    return (
                        <button 
                            className="rounded-btn" 
                            disabled={ activeBtn === currentBtn } 
                            name={ currentBtn } 
                            onClick={ e => { handleChangeSubSection(e) } }
                        >
                                { currentBtn }
                        </button>
                    )
                })
            }
        </div>
    );
}