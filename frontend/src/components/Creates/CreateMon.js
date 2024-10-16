import React, { useEffect, useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import SearchMultiSelect from "../UserInteractions/SearchMultiSelect";
import ImagesUpload from "../UserInteractions/ImagesUpload";

export default function CreateMon() {
    /* PLACEHOLDERS!!! Eventually will be replaced with data from backend! */
    const types = {Pokemon: ["fire", "water", "grass", "ice", "dragon", "ground", "rock", "electric", "bug", "normal", "fighting", "psychic", "steel", "poison", "flying", "dark", "ghost", "fairy"], 
        Temtem: ["neutral", "wind", "earth", "water", "fire", "nature", "electric", "mental", "digital", "melee", "crystal", "toxic"]};
    const abilities = {Pokemon: ["Adaptability", "Aerilate", "Cursed Body", "Drought", "Pure Power"], 
        Temtem: ["Aggressor", "Arcane Wrap", "Benefactor", "Channeler", "Coward's Rest", "Synergy Master"]};

    const [group, setGroup] = useState("");
    const [chosenTypes, setChosenTypes] = useState([]);
    const [chosenAbilities, setChosenAbilities] = useState([]);
    const [chosenHiddenAbility, setchosenHiddenAbility] = useState([]);

    function handleSetGroup(groupName) {
        if(groupName !== "") {
            setGroup(groupName);
        }
    }

    useEffect(() => {
        if(chosenAbilities.length === 0 && chosenHiddenAbility.length === 0 && chosenTypes.length === 0) {
            setGroup("");
        } 
    }, [chosenAbilities, chosenHiddenAbility, chosenTypes]);

    return (
        <div className="article-container">
            <Form>
                <div className="bottom-barrier"><h3>Create New Monster</h3></div>
                <ImagesUpload />
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
                            <label className="col-label">Average Height</label>
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
                            <label className="col-label">Average Weight</label>
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
            </Form>
        </div>
    );
}