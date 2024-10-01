import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import TextContent from "./TextContent";

import "../../assets/styling/content.css";
import "../../assets/styling/UserProfile.css";
import "../../assets/styling/ViewMon.css";

export default function GeographyTab({ content={} }) {
    const [tab, setTab] = useState("settlements");

    return (
        <>
            <Tabs className="explore-tabs" activeKey={ tab } onSelect={ (k) => setTab(k) }>
                <Tab tabClassName="rounded-btn explore-btn" title="Settlements" eventKey="settlements">
                    <TextContent content = {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget ligula massa. Nam imperdiet elit sed sem lacinia volutpat. Cras fermentum tempor nibh, eget maximus neque scelerisque quis. Nunc commodo cursus porttitor.\n\n Nulla laoreet enim sit amet purus scelerisque, quis vehicula massa blandit. Mauris eget aliquam purus. Nullam dolor leo, porta non metus nec, ultrices tincidunt elit. Fusce in augue eget leo faucibus tincidunt eget sit amet felis. \r\n\n\n\nSed vitae quam sit amet velit dictum egestas. Vivamus vitae convallis nisi. Nam in nisi ultricies, elementum nunc sed, porttitor enim. Fusce fringilla nibh in turpis commodo ultrices. Vivamus lectus velit, mattis.\n\n Nulla laoreet enim sit amet purus scelerisque, quis vehicula massa blandit. Mauris eget aliquam purus. Nullam dolor leo, porta non metus nec, ultrices tincidunt elit. Fusce in augue eget leo faucibus tincidunt eget sit amet felis. \r\n\n\n\nSed vitae quam sit amet velit dictum egestas. Vivamus vitae convallis nisi. Nam in nisi ultricies, elementum nunc sed, porttitor enim. Fusce fringilla nibh in turpis commodo ultrices. Vivamus lectus velit, mattis."} />
                </Tab>
                <Tab tabClassName="rounded-btn explore-btn" title="LandMarks" eventKey="landmarks">
                    <TextContent content = {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget ligula massa. Nam imperdiet elit sed sem lacinia volutpat. Cras fermentum tempor nibh, eget maximus neque scelerisque quis. Nunc commodo cursus porttitor.\n\n Nulla laoreet enim sit amet purus scelerisque, quis vehicula massa blandit. Mauris eget aliquam purus. Nullam dolor leo, porta non metus nec, ultrices tincidunt elit. Fusce in augue eget leo faucibus tincidunt eget sit amet felis. \r\n\n\n\nSed vitae quam sit amet velit dictum egestas. Vivamus vitae convallis nisi. Nam in nisi ultricies, elementum nunc sed, porttitor enim. Fusce fringilla nibh in turpis commodo ultrices. Vivamus lectus velit, mattis."} />
                </Tab>
                <Tab tabClassName="rounded-btn explore-btn" title="Routes" eventKey="routes">
                    {/* <Content /> */}
                </Tab>
            </Tabs>

        </>
    )
}