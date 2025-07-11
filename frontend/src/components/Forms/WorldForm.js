import { Button, Form, FloatingLabel, FormControl } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { DiscardModal } from '../Modals/DiscardModal';
import { useDiscardModal } from '../../hooks/modal/use-discard-modal';

export default function WorldForm({ formData, resetFormData, setFormData }) {
  const [showDiscard, setShowDiscard] = useDiscardModal(formData, (b) => navigate('/'));
  const navigate = useNavigate();

  const { name, description, move_alias, course_alias, evolution_alias, monster_alias, ability_alias, level_cap } = formData;

  function handleLevelCap(e, setFormData) {
    const value = e.target.value;
    if (value === '') {
      setFormData({ target: { name: 'level_cap', value: 0 } });
    }

    const cap = parseInt(value);
    if(!isNaN(cap) || cap < 1) {
      setFormData({ target: { name: 'level_cap', value: cap } });
    }
  }

  return (
    <>
      <DiscardModal setShowDiscard={setShowDiscard} showDiscard={showDiscard} resetFormData={resetFormData} />
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

          <div className='row-gap-container right-justify-container no-margins-container'>
            <Button 
              className='base-btn' 
              id='discard-post-btn'
              onClick={ e => setShowDiscard(e, true) }
            >
              Cancel
            </Button>
            <Button className='base-btn' onClick={e => setFormData(e, { name, description, move_alias, course_alias, evolution_alias, monster_alias, ability_alias, level_cap }) }>
              Submit
            </Button>
          </div>
          <div className='section-bottom-barrier'></div>
        </Form>
      </div>
    </>
  );
}