import { React, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import SearchModal from './Modals/SearchModal';

import "../assets/styling/forms.css";
import "../assets/styling/App.css";

export default function SearchBar({ setQuery, width }) {
    const [formData, setFormData] = useState("");
    const [show, setShow] = useState(false);

    const search = formData;

    function onSubmit(e) {
        e.preventDefault();
        setQuery(search);
    }

    return (
        <>
            <SearchModal setQuery={ setQuery } show={ show } setShow={ () => setShow() } />
            <Form className="form search" onSubmit={ e => onSubmit(e) }>
                <InputGroup 
                    className={ width ? "search-container" : "search-container open" } 
                    id="search-group"
                    onClick={ width ? () => setShow(true) : () => {} }
                >
                    <InputGroup.Text>
                        <BsSearch />
                    </InputGroup.Text>
                    <Form.Control 
                        type="search" 
                        className="me-2 search search-input" 
                        id="search-input"
                        placeholder="Search" 
                        name="search"
                        value={ search }
                        onChange={ e => setFormData(e.target.value) }
                    />
                </InputGroup>   
            </Form>
        </>
    );

}