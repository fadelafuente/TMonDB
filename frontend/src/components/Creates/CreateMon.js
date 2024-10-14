import React, { useState } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Select from 'react-select';

export default function CreateMon() {
    const types = ["fire", "water", "grass", "ice", "dragon", "ground", "rock", "electric", "bug", "normal", "fighting", "psychic", "steel", "poison", "flying", "fairy", "dark", "ghost"];
    const [chosenTypes, setChosenTypes] = useState([]);

    function MakeOption(t) {
        return {value: t, label: t};
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
                    isMulti 
                    isClearable
                    closeMenuOnSelect={false}
                    options={ types.map(type => MakeOption(type)) } 
                    onChange={ e => setChosenTypes(e.map((dict, _) => { return dict["value"] })) }
                />
            </Form>
        </div>
    );
}