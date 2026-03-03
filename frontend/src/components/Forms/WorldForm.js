import { useState } from 'react';
import { Button, Form, FloatingLabel, FormControl, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DiscardModal } from '../Modals/DiscardModal';
import { useDiscardModal } from '../../hooks/modal/use-discard-modal';
import { BsDashCircle, BsPlusCircle } from 'react-icons/bs';
import { handleAbbreviations } from '../../functions/handlers';

export default function WorldForm({ formData, resetFormData, setFormData }) {
  const [showDiscard, setShowDiscard] = useDiscardModal(formData, (b) => navigate('/'));
  const [newProperty, setNewProperty] = useState('');
  const [newAbbreviation, setNewAbbreviation] = useState('');
  const navigate = useNavigate();

  const { name, description, move_alias, course_alias, evolution_alias, monster_alias, ability_alias, level_cap, properties } = formData;

  function handleLevelCap(e, setFormData) {
    const value = e.target.value;
    if(value === '') {
      setFormData({ target: { name: 'level_cap', value: 0 } });
    }

    const cap = parseInt(value);
    if(!isNaN(cap) || cap >= 1) {
      setFormData({ target: { name: 'level_cap', value: cap } });
    }
  }

  function handleAddProperties(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if(properties.length >= 10 || !newProperty) {
      return;
    }
    if(properties.findIndex(o => o['name'] === newProperty) === -1) {
      resetFormData(
        {
          target: {
            name: 'properties',
            value: [...properties, { name: newProperty, abbreviation: newAbbreviation }]
          }
        }
      );
    }
    setNewProperty('');
    setNewAbbreviation('');
  }

  function handleDeleteProperty(r) {
    const filtered = [...properties].filter((p) => p !== r);
    resetFormData({target: {name: 'properties', value: filtered}});
  }

  return (
    <>
      <DiscardModal
        setShowDiscard={ setShowDiscard }
        showDiscard={ showDiscard }
        resetFormData={ resetFormData }
        discard_type='world'
      />
      <div className='article-container bottom-barrier'>
        <Form>
          <FloatingLabel controlId='floatingInput' label='Name*' className='mb-3'>
            <FormControl 
              type='text'
              placeholder='Name'
              name='name'
              value={ name }
              onChange={ (e) => resetFormData(e) }
            />
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' label='Monster Alias' className='mb-3'>
            <FormControl 
              type='text'
              placeholder='Monster Alias'
              name='monster_alias'
              value={ monster_alias }
              onChange={ (e) => resetFormData(e) }
            />
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' label='Level Cap' className='mb-3'>
            <FormControl 
              type='text'
              placeholder='Level Cap'
              name='level_cap'
              value={ level_cap }
              onChange={ (e) => handleLevelCap(e, d => resetFormData(d)) }
            />
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' label='Evolution Alias' className='mb-3'>
            <FormControl 
              type='text'
              placeholder='Evolution Alias'
              name='evolution_alias'
              value={ evolution_alias }
              onChange={ (e) => resetFormData(e) }
            />
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' label='Ability Alias' className='mb-3'>
            <FormControl 
              type='text'
              placeholder='Ability Alias'
              name='ability_alias'
              value={ ability_alias }
              onChange={ (e) => resetFormData(e) }
            />
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' label='Move Alias' className='mb-3'>
            <FormControl 
              type='text'
              placeholder='Move Alias'
              name='move_alias'
              value={ move_alias }
              onChange={ (e) => resetFormData(e) }
            />
          </FloatingLabel>

          <FloatingLabel controlId='floatingInput' label='Course Alias' className='mb-3'>
            <FormControl 
              type='text'
              placeholder='Course Alias'
              name='course_alias'
              value={ course_alias }
              onChange={ (e) => resetFormData(e) }
            />
          </FloatingLabel>

          <div className='left-justify-container mb-3'>
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

          <div className='bottom-barrier left-justify-container'>
            <div className='col-container left-justify-container mb-1'>
              <label className='col-label'>Move Properties ({ properties.length }/10)</label>
              <small>Examples: Accuracy, Critical Hit Chance, Cooldown, etc.</small>
            </div>
            <div className='type-row'>
              <input className='type-input' 
                onChange={ e => { setNewProperty(e.target.value); setNewAbbreviation(handleAbbreviations(e.target.value)); }} 
                value={ newProperty }
              />
              <input className='type-input' onChange={ e => setNewAbbreviation(e.target.value) } value={ newAbbreviation } />
              <button className='svg-btn svg-resize-btn' onClick={ (e) => handleAddProperties(e) }>
                <BsPlusCircle />
              </button>
            </div>
            <hr />
            {
              Array.from(properties, property => (
                <div className='form-list-container' key={ `property-${ property.name }` }>
                  <div className='form-list-name'>
                    { property.name }
                  </div>
                  <div className='form-list-abbreviation'>
                    { property.abbreviation }
                  </div>
                  <button className='svg-btn svg-resize-btn remove-btn' onClick={ () => handleDeleteProperty(property) }>
                    <BsDashCircle />
                  </button>
                </div>
              ))
            }
          </div>
          { properties.length > 0 ? <hr /> : <></> }

          <div className='row-gap-container right-justify-container no-margins-container'>
            <Button 
              className='base-btn' 
              id='discard-post-btn'
              onClick={ e => setShowDiscard(e, true) }
            >
              Cancel
            </Button>
            <Button className='base-btn' onClick={e => setFormData(e, { name, description, move_alias, course_alias, evolution_alias, monster_alias, ability_alias, level_cap, properties }) }>
              Submit
            </Button>
          </div>
          <div className='section-bottom-barrier'></div>
        </Form>
      </div>
    </>
  );
}