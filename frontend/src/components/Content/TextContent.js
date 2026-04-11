import "../../assets/styling/content.css";
import "../../assets/styling/UserProfile.css";
import "../../assets/styling/ViewMon.css";

export default function TextContent({ content }) {
    const contentBlocks = content.replace(/[\r\n]+/g, "\n").split("\n");
    

    return (
        <>
            {
                contentBlocks.map((block) => {
                    return <p>{ block }</p>
                })
            }
        </>
    )
}