import React, { useEffect, useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import SearchMultiSelect from "../UserInteractions/SearchMultiSelect";
import ImagesUpload from "../UserInteractions/ImagesUpload";
import { useAdaptiveFormData } from "../../hooks/hooks";

export default function CreateMon() {
    /* 
        PLACEHOLDERS!!! Eventually will be replaced with data from backend! 

        NOTES: This could be A LOT of information being returned, so should probably make it
               paginated, or have the types/abilities/moves disabled until the user chooses
               a region. This might require an extra call to the backend to get this info.

               location might be nice to have grouped by region instead of world
    */
    const types = {Pokemon: ["fire", "water", "grass", "ice", "dragon", "ground", "rock", "electric", "bug", "normal", "fighting", "psychic", "steel", "poison", "flying", "dark", "ghost", "fairy"], 
        Temtem: ["neutral", "wind", "earth", "water", "fire", "nature", "electric", "mental", "digital", "melee", "crystal", "toxic"]};
    const abilities = {Pokemon: ["Adaptability", "Aerilate", "Cursed Body", "Drought", "Pure Power"], 
        Temtem: ["Aggressor", "Arcane Wrap", "Benefactor", "Channeler", "Coward's Rest", "Synergy Master"]};
    const regions = {Pokemon: ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"], 
        Temtem: ["Deniz", "Omninesia", "Tucma", "Kisiwa", "Cipanku", "Arbury"]};
    const moves = {Pokemon: ["Aqua Tail", "Dragon Rush", "Thunderbolt", "Flamethrower", "Ice Beam", "Waterfall"], 
        Temtem: ["Martial Kick", "Uppercut", "Heat Up", "Helicopter Kick", "Wrenching Massage", "Seismunch's Wreck", "Dim Mak"]};
    const locations = {Pokemon: ["Viridian Forest", "Pallet Town", "Trophy Garden", "Route 1", "Forest of Focus"], 
        Temtem: ["Dabmis' Rest", "Aguamarina Caves", "Corrupted Badlands", "Xolot Reservoir", "Mawingu Islets"]};

    const [group, setGroup] = useState("");
    const [chosenRegions, setChosenRegions] = useState([]);
    const [chosenTypes, setChosenTypes] = useState([]);
    const [chosenAbilities, setChosenAbilities] = useState([]);
    const [chosenHiddenAbility, setchosenHiddenAbility] = useState([]);
    const [chosenMoves, setChosenMoves] = useState([]);
    const [chosenLocations, setChosenLocations] = useState([]);
    const [formData, setFormData] = useAdaptiveFormData("");
    const [etymologyData, setEtymologyData] = useAdaptiveFormData("");
    const [inspoData, setInspoData] = useAdaptiveFormData("");
    
    const { description } = formData;
    const { etymology } = etymologyData;
    const { inspiration } = inspoData;

    function handleSetGroup(groupName) {
        if(groupName !== "") {
            setGroup(groupName);
        }
    }

    useEffect(() => {
        if(chosenAbilities.length === 0 && 
            chosenHiddenAbility.length === 0 && 
            chosenTypes.length === 0 && 
            chosenMoves.length === 0 &&
            chosenLocations.length === 0
        ) {
            setGroup("");
        } 
    }, [chosenAbilities, chosenHiddenAbility, chosenTypes, chosenMoves, chosenLocations]);

    return (
        <div className="article-container">
            <Form>
                <div className="bottom-barrier"><h2>Create New Monster</h2></div>
                <ImagesUpload />
                <div className="section-bottom-barrier">
                    <div className="bottom-barrier"><h4>Basic Information</h4></div>
                    <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                        <FormControl type="text" placeholder="Name" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="National Id" className="mb-3">
                        <FormControl type="text" placeholder="National Id" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Species" className="mb-3">
                        <FormControl type="text" placeholder="Species" />
                    </FloatingLabel>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div className="text-align-top">
                                <label className="col-label shift-down-label">Average Height</label>
                            </div>
                            <div className="row-to-col-container">
                                <InputGroup>
                                    <FormControl type="text" placeholder="0" className="text-align-right" />
                                    <InputGroup.Text id="basic-addon2">
                                        ft
                                    </InputGroup.Text>
                                    <FormControl type="text" placeholder="0" className="text-align-right" />
                                    <InputGroup.Text id="basic-addon2">
                                        in
                                    </InputGroup.Text>
                                </InputGroup>
                                <InputGroup>
                                    <FormControl type="text" placeholder="0" className="text-align-right" />
                                    <InputGroup.Text id="basic-addon2">
                                        cm
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div className="text-align-top">
                                <label className="col-label shift-down-label">Average Weight</label>
                            </div>
                            <div className="row-to-col-container">
                                <InputGroup>
                                    <FormControl type="text" placeholder="0" className="text-align-right" max={9999.99} min={0} />
                                    <InputGroup.Text id="basic-addon2">
                                        lbs
                                    </InputGroup.Text>
                                </InputGroup>
                                <InputGroup>
                                    <Form.Control type="text" placeholder="0" className="text-align-right" max={999.99} min={0} />
                                    <InputGroup.Text id="basic-addon2">
                                        kg
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-to-col-container left-justify-container">
                            <div>
                                <label className="col-label shift-down-reverse">Description</label>
                            </div>
                            <div className="input-textarea-container">
                                <Form.Group controlId="auto-resizing">
                                    <Form.Control 
                                        as="textarea"
                                        className="input-textarea" 
                                        placeholder=""
                                        value={ description }
                                        name="description"
                                        onChange={ e => setFormData(e) } 
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-bottom-barrier">
                    <div className="bottom-barrier"><h4>Regional Information</h4></div>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div>
                                <label className="col-label">Region(s)</label>
                            </div>
                            <SearchMultiSelect 
                                initialGroupedItems={ regions } 
                                group={ group } 
                                setGroup={ handleSetGroup } 
                                chosenItems={ chosenRegions } 
                                setChosenItems={ (t) => setChosenRegions(t) } 
                            />
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div>
                                <label className="col-label">Type(s)</label>
                            </div>
                            <SearchMultiSelect 
                                initialGroupedItems={ types } 
                                group={ group } 
                                setGroup={ handleSetGroup } 
                                chosenItems={ chosenTypes } 
                                setChosenItems={ (t) => setChosenTypes(t) } 
                                limit = { 2 }
                            />
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div>
                                <label className="col-label">Abilities</label>
                            </div>
                            <SearchMultiSelect 
                                initialGroupedItems={ abilities } 
                                group={ group } 
                                setGroup={ handleSetGroup } 
                                chosenItems={ chosenAbilities } 
                                setChosenItems={ (a) => setChosenAbilities(a) } 
                                limit = { 2 }
                            />
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div>
                                <label className="col-label">Hidden Ability</label>
                            </div>
                            <SearchMultiSelect 
                                initialGroupedItems={ abilities } 
                                group={ group } 
                                setGroup={ handleSetGroup } 
                                chosenItems={ chosenHiddenAbility } 
                                setChosenItems={ (a) => setchosenHiddenAbility(a) } 
                                limit = { 1 }
                            />
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div>
                                <label className="col-label">Move(s)</label>
                            </div>
                            <SearchMultiSelect 
                                initialGroupedItems={ moves } 
                                group={ group } 
                                setGroup={ handleSetGroup } 
                                chosenItems={ chosenMoves } 
                                setChosenItems={ (m) => setChosenMoves(m) } 
                            />
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-gap-container">
                            <div>
                                <label className="col-label">Location(s)</label>
                            </div>
                            <SearchMultiSelect 
                                initialGroupedItems={ locations } 
                                group={ group } 
                                setGroup={ handleSetGroup } 
                                chosenItems={ chosenLocations } 
                                setChosenItems={ (l) => setChosenLocations(l) } 
                            />
                        </div>
                    </div>
                </div>
                <div className="section-bottom-barrier">
                    <div className="bottom-barrier"><h4>Miscellaneous Information</h4></div>
                    <div className="bottom-barrier">
                        <div className="row-to-col-container left-justify-container">
                            <div>
                                <label className="col-label shift-down-reverse">Etymology</label>
                            </div>
                            <div className="input-textarea-container">
                                <Form.Group controlId="auto-resizing">
                                    <Form.Control 
                                        as="textarea"
                                        className="input-textarea" 
                                        placeholder=""
                                        value={ etymology }
                                        name="etymology"
                                        onChange={ e => setEtymologyData(e) } 
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-barrier">
                        <div className="row-to-col-container left-justify-container">
                            <div>
                                <label className="col-label shift-down-reverse">Inspiration</label>
                            </div>
                            <div className="input-textarea-container">
                                <Form.Group controlId="auto-resizing">
                                    <Form.Control 
                                        as="textarea"
                                        className="input-textarea" 
                                        placeholder=""
                                        value={ inspiration }
                                        name="inspiration"
                                        onChange={ e => setInspoData(e) } 
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}