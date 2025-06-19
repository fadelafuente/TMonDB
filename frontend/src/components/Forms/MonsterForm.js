import React, { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { DiscardModal } from '../Modals/DiscardModal';
import ImagesUpload from '../UserInteractions/ImagesUpload';
import SearchMultiSelect from '../UserInteractions/SearchMultiSelect';
import { capitalize } from '../../functions/handlers';
import { useWeightConversions } from '../../hooks/conversions/use-weight-conversions';
import { useHeightConversions } from '../../hooks/conversions/use-height-conversions';
import { useDiscardModal } from '../../hooks/modal/use-discard-modal';

export default function MonsterForm({ action, formData, resetFormData, setFormData }) {
    /* 
        PLACEHOLDERS!!! Eventually will be replaced with data from backend! 

        NOTES: This could be A LOT of information being returned, so should probably make it
                paginated, or have the types/abilities/moves disabled until the user chooses
                a region. This might require an extra call to the backend to get this info.

                location might be nice to have grouped by region instead of world
    */
    const worlds = ['Pokemon', 'Temtem', 'Nexomon']
    const types = {Pokemon: ['fire', 'water', 'grass', 'ice', 'dragon', 'ground', 'rock', 'electric', 'bug', 'normal', 'fighting', 'psychic', 'steel', 'poison', 'flying', 'dark', 'ghost', 'fairy'], 
        Temtem: ['neutral', 'wind', 'earth', 'water', 'fire', 'nature', 'electric', 'mental', 'digital', 'melee', 'crystal', 'toxic'],
        Nexomon: []};
    const abilities = {Pokemon: ['Adaptability', 'Aerilate', 'Cursed Body', 'Drought', 'Pure Power'], 
        Temtem: ['Aggressor', 'Arcane Wrap', 'Benefactor', 'Channeler', 'Coward\'s Rest', 'Synergy Master'],
        Nexomon: []};
    const regions = {Pokemon: ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'], 
        Temtem: ['Deniz', 'Omninesia', 'Tucma', 'Kisiwa', 'Cipanku', 'Arbury'],
        Nexomon: []};
    const moves = {Pokemon: ['Aqua Tail', 'Dragon Rush', 'Thunderbolt', 'Flamethrower', 'Ice Beam', 'Waterfall'], 
        Temtem: ['Martial Kick', 'Uppercut', 'Heat Up', 'Helicopter Kick', 'Wrenching Massage', 'Seismunch\'s Wreck', 'Dim Mak'],
        Nexomon: []};
    const locations = {
        Pokemon: {
            Kanto: ['Power Plant', 'Pallet Town', 'Viridian Forest'], 
            Johto: ['Celadon City'],
            Hoenn: ['Safari Zone'],
            Sinnoh: ['Trophy Garden'],
            Unova: [],
            Kalos: ['Route 3', 'Santalune City'], 
            Alola: ['Route 1', 'Hau\'oli City'], 
            Galar: ['Route 4', 'Stony Wilderness', 'Forest of Focus'], 
            Paldea: ['East Province', 'South Province', 'West Province']
        },
        Temtem: {
            Deniz: ['Prasine Coast', 'Thalassian Cliffs', 'The Gifted Bridges', 'Sillaro River'],
            Omninesia: ['The Glassyway', 'Anak Caldera', 'The Hangroad'],
            Tucma: ['Corrupted Badlands', 'Xolot Reservoir', 'Mines of Mictlan', 'Gardens of Aztlan'],
            Kisiwa: ['Mawingu Islets', 'Jino Gap', 'Tasa Desert', 'Kilima Peaks'],
            Cipanku: ['Iwaba', 'Rice Fields'],
            Arbury: ['Meadowdale', 'Ruins of Telobos', 'Burned Woodlands']
        },
        Nexomon: {}
    };

    const [chosenHeightFt, setChosenHeightFt, 
        chosenHeightIn, setChosenHeightIn, setChosenHeightM] = useHeightConversions('', '');
    const [chosenWeightLb, setChosenWeightLb, setChosenWeightKg] = useWeightConversions('', '');
    const [chosenWorld, setChosenWorld] = useState(null);
    const [chosenRegions, setChosenRegions] = useState([]);
    const [chosenTypes, setChosenTypes] = useState([]);
    const [chosenAbilities, setChosenAbilities] = useState([]);
    const [chosenHiddenAbility, setchosenHiddenAbility] = useState([]);
    const [chosenMoves, setChosenMoves] = useState([]);
    const [chosenLocations, setChosenLocations] = useState([]);
    const [chosenEvolutions, setChosenEvolutions] = useState([]);
    const [chosenPreEvolutions, setChosenPreEvolutions] = useState([]);
    const navigate = useNavigate();
    const [showDiscard, setShowDiscard] = useDiscardModal(formData, (b) => navigate('/'));

    // Reset regional information on world change
    useEffect(() => {
        setChosenLocations([]);
        setChosenTypes([]);
        setChosenAbilities([]);
        setchosenHiddenAbility([]);
        setChosenMoves([]);
        setChosenRegions([]);
    }, [chosenWorld]);

    let { name, national_id, species, description, etymology, avg_weight, avg_height } = formData;

    return (
        <>
            <DiscardModal setShowDiscard={setShowDiscard} showDiscard={showDiscard} resetFormData={resetFormData} />
            <div className='article-container'>
                <Form>
                    <div className='bottom-barrier'><h2>{ capitalize(action) } Monster</h2></div>
                    <ImagesUpload />
                    <div className='section-bottom-barrier'>
                        <div className='bottom-barrier'><h4>Basic Information</h4></div>
                        <FloatingLabel controlId='floatingInput' label='Name' className='mb-3'>
                            <FormControl 
                                type='text'
                                placeholder='Name'
                                name='name'
                                value={ name }
                                onChange={ (e) => resetFormData(e) }
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId='floatingInput' label='National Id' className='mb-3'>
                            <FormControl
                                type='text' 
                                placeholder='National Id' 
                                name='national_id'
                                value={ national_id } 
                                onChange={ (e) => resetFormData(e) }
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId='floatingInput' label='Species' className='mb-3'>
                            <FormControl
                                type='text'
                                placeholder='Species'
                                name='species'
                                value={ species }
                                onChange={ (e) => resetFormData(e) }
                            />
                        </FloatingLabel>
                        <div className='bottom-barrier'>
                            <div className='row-gap-container'>
                                <div className='text-align-top'>
                                    <label className='col-label shift-down-label'>Average Height</label>
                                </div>
                                <div className='row-to-col-container'>
                                    <InputGroup>
                                        <FormControl 
                                            type='text' 
                                            placeholder='0' 
                                            className='text-align-right'
                                            value={ chosenHeightFt }
                                            onChange={ (e) => setChosenHeightFt(e, (d) => resetFormData(d)) }
                                        />
                                        <InputGroup.Text id='basic-addon2'>
                                            ft
                                        </InputGroup.Text>
                                        <FormControl 
                                            type='text' 
                                            placeholder='0' 
                                            className='text-align-right' 
                                            value={ chosenHeightIn }
                                            onChange={ (e) => setChosenHeightIn(e, (d) => resetFormData(d)) }
                                        />
                                        <InputGroup.Text id='basic-addon2'>
                                            in
                                        </InputGroup.Text>
                                    </InputGroup>
                                    <InputGroup>
                                        <FormControl
                                            id='average-height-input'
                                            type='text' 
                                            placeholder='0' 
                                            className='text-align-right'
                                            value={ avg_height }
                                            name='avg_height'
                                            onChange={ (e) => setChosenHeightM(e, (d) => resetFormData(d)) }
                                        />
                                        <InputGroup.Text id='basic-addon2'>
                                            m
                                        </InputGroup.Text>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <div className='bottom-barrier'>
                            <div className='row-gap-container'>
                                <div className='text-align-top'>
                                    <label className='col-label shift-down-label'>Average Weight</label>
                                </div>
                                <div className='row-to-col-container'>
                                    <InputGroup>
                                        <FormControl 
                                            type='text' 
                                            placeholder='0' 
                                            className='text-align-right' 
                                            value={ chosenWeightLb }
                                            onChange={ (e) => setChosenWeightLb(e, (d) => resetFormData(d)) }
                                        />
                                        <InputGroup.Text id='basic-addon2'>
                                            lbs
                                        </InputGroup.Text>
                                    </InputGroup>
                                    <InputGroup>
                                        <Form.Control
                                            id='average-weight-input' 
                                            type='text'
                                            placeholder='0'
                                            className='text-align-right'
                                            value={ avg_weight }
                                            name='avg_weight'
                                            onChange={ (e) => setChosenWeightKg(e, (d) => resetFormData(d)) }
                                        />
                                        <InputGroup.Text id='basic-addon2'>
                                            kg
                                        </InputGroup.Text>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <div className='bottom-barrier'>
                            <div className='row-to-col-container left-justify-container'>
                                <div>
                                    <label className='col-label shift-down-reverse'>Description</label>
                                </div>
                                <div className='input-textarea-container'>
                                    <Form.Group controlId='auto-resizing'>
                                        <Form.Control 
                                            as='textarea'
                                            className='input-textarea' 
                                            placeholder=''
                                            value={ description }
                                            name='description'
                                            onChange={ e => resetFormData(e) } 
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='section-bottom-barrier'>
                        <div className='bottom-barrier'><h4>World Information</h4></div>
                        <div className='bottom-barrier'>
                            <div className='row-gap-container'>
                                <div>
                                    <label className='col-label'>World</label>
                                </div>
                                <SearchMultiSelect
                                    className='multiselect-container'
                                    classNamePrefix='multiselect'
                                    isClearable
                                    initialItems={ worlds } 
                                    chosenItems={ chosenWorld }
                                    setChosenItems={ (w) => setChosenWorld(w) }
                                />
                            </div>
                        </div>
                        <div className={ chosenWorld ? '' : 'hidden-info-container' }>
                            <div className='bottom-barrier'>
                                <div className='row-gap-container'>
                                    <div>
                                        <label className='col-label'>Type(s)</label>
                                    </div>
                                    <SearchMultiSelect 
                                        initialItems={ types } 
                                        groups={ chosenWorld != null ? [chosenWorld] : [] } 
                                        chosenItems={ chosenTypes } 
                                        setChosenItems={ (t) => setChosenTypes(t) } 
                                        limit={ 2 }
                                        isMulti={ true }
                                        isGrouped={ true }
                                    />
                                </div>
                            </div>
                            <div className='bottom-barrier'>
                                <div className='row-gap-container'>
                                    <div>
                                        <label className='col-label'>Abilities</label>
                                    </div>
                                    <SearchMultiSelect 
                                        initialItems={ abilities } 
                                        groups={ chosenWorld != null ? [chosenWorld] : [] } 
                                        chosenItems={ chosenAbilities } 
                                        setChosenItems={ (a) => setChosenAbilities(a) } 
                                        limit = { 2 }
                                        isMulti={ true }
                                        isGrouped={ true }
                                    />
                                </div>
                            </div>
                            <div className='bottom-barrier'>
                                <div className='row-gap-container'>
                                    <div>
                                        <label className='col-label'>Hidden Ability</label>
                                    </div>
                                    <SearchMultiSelect 
                                        initialItems={ abilities } 
                                        groups={ chosenWorld != null ? [chosenWorld] : [] } 
                                        chosenItems={ chosenHiddenAbility } 
                                        setChosenItems={ (a) => setchosenHiddenAbility(a) } 
                                        limit = { 1 }
                                        isMulti={ true }
                                        isGrouped={ true }
                                    />
                                </div>
                            </div>
                            <div className='bottom-barrier'>
                                <div className='row-gap-container'>
                                    <div>
                                        <label className='col-label'>Region(s)</label>
                                    </div>
                                    <SearchMultiSelect 
                                        initialItems={ regions } 
                                        groups={ chosenWorld != null ? [chosenWorld] : [] } 
                                        chosenItems={ chosenRegions } 
                                        setChosenItems={ (t) => setChosenRegions(t) } 
                                        isMulti={ true }
                                        isGrouped={ true }
                                    />
                                </div>
                            </div>
                            <div className={ chosenRegions.length > 0 ? '' : 'hidden-info-container' }>
                                <div className='bottom-barrier'>
                                    <div className='row-gap-container'>
                                        <div>
                                            <label className='col-label'>Location(s)</label>
                                        </div>
                                        < SearchMultiSelect
                                            initialItems={ chosenWorld ? locations[chosenWorld['value']] : [] } 
                                            groups={ chosenRegions }
                                            chosenItems={ chosenLocations } 
                                            setChosenItems={ (l) => setChosenLocations(l) } 
                                            isMulti={ true }
                                            isGrouped={ true }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='bottom-barrier'>
                                <div className='row-gap-container'>
                                    <div>
                                        <label className='col-label'>Evolution(s)</label>
                                    </div>
                                    <SearchMultiSelect
                                        isClearable
                                        initialItems={ [] } 
                                        chosenItems={ chosenEvolutions } 
                                        setChosenItems={ (e) => setChosenEvolutions(e) } 
                                    />
                                </div>
                            </div>
                            <div className='bottom-barrier'>
                                <div className='row-gap-container'>
                                    <div>
                                        <label className='col-label'>Pre-Evolution(s)</label>
                                    </div>
                                    <SearchMultiSelect
                                        isClearable
                                        initialItems={ [] } 
                                        chosenItems={ chosenPreEvolutions } 
                                        setChosenItems={ (e) => setChosenPreEvolutions(e) } 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='section-bottom-barrier'>
                        <div className='bottom-barrier'><h4>Miscellaneous Information</h4></div>
                        <div className='bottom-barrier'>
                            <div className='row-to-col-container left-justify-container'>
                                <div>
                                    <label className='col-label shift-down-reverse'>Etymology</label>
                                </div>
                                <div className='input-textarea-container'>
                                    <Form.Group controlId='auto-resizing'>
                                        <Form.Control 
                                            as='textarea'
                                            className='input-textarea' 
                                            placeholder=''
                                            value={ etymology }
                                            name='etymology'
                                            onChange={ e => resetFormData(e) } 
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row-gap-container right-justify-container no-margins-container'>
                        <Button 
                            className='base-btn' 
                            id='discard-post-btn'
                            onClick={ e => setShowDiscard(e, true) }
                        >
                            Cancel
                        </Button>
                        <Button className='base-btn' onClick={e => { setFormData(e, 'monsters', { name, national_id, species, description, etymology, avg_weight, avg_height });} }>
                            { capitalize(action) }
                        </Button>
                    </div>
                    <div className='section-bottom-barrier'></div>
                </Form>
            </div>
        </>
    );
}