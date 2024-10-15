import React, { useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Select from 'react-select';

export default function CreateMon() {
    /* PLACEHOLDERS!!! Eventually will be replaced with data from backend! */
    const types = {Pokemon: ["fire", "water", "grass", "ice", "dragon", "ground", "rock", "electric", "bug", "normal", "fighting", "psychic", "steel", "poison", "flying", "dark", "ghost", "fairy"], 
        Temtem: ["neutral", "wind", "earth", "water", "fire", "nature", "electric", "mental", "digital", "melee", "crystal", "toxic"]};
    
    const [groupedTypes, setGroupedTypes] = useState(
        Object.keys(types).map((key, _) => {
            const currentGroup = types[key].map(type => MakeOption(type, key));
            return {label: key, options: currentGroup};
        })
    ); 
    const [chosenTypes, setChosenTypes] = useState([]);

    function MakeOption(t, g) {
        return {value: t, label: t, groupName: g};
    }

    function onTypesChange(e) {
        if(e.length > 0) { 
            const groupName = e[0]["groupName"]; 
            const groupOptions = types[groupName].map(type => MakeOption(type, groupName));
            setGroupedTypes([{label: groupName, options: groupOptions}]);
        } else {
            setGroupedTypes(
                Object.keys(types).map((key, _) => {
                    const currentGroup = types[key].map(type => MakeOption(type, key));
                    return {label: key, options: currentGroup};
                })
            );
        }

        setChosenTypes(e.map((dict, _) => { return dict["value"] }));
    }

    return (
        <div className="article-container">
            <Form>
                <div className="bottom-barrier"><h3>Create New Monster</h3></div>
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
                <Select
                    className="multiselect-container"
                    classNamePrefix="multiselect"
                    isMulti 
                    isClearable
                    closeMenuOnSelect={false}
                    options={ groupedTypes } 
                    onChange={ e => onTypesChange(e) }
                    isOptionDisabled={ () => chosenTypes.length >= 2 }
                />
            </Form>
        </div>
    );
}