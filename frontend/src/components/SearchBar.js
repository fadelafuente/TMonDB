import { React, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { BsSearch, BsXLg } from 'react-icons/bs';

import "../assets/styling/forms.css";
import "../assets/styling/App.css";

export default function SearchBar({setQuery}) {
    const [formData, setFormData] = useState("");

    const search = formData;

    function onSubmit(e) {
        e.preventDefault();
        setQuery(search);
    }

    function onClickOpenSearch() {
        const searchGroup = document.getElementById("search-group");
        searchGroup.classList.add("open");
        
    }

    function onClickCloseSearch() {
        const searchGroup = document.getElementById("search-group");
        searchGroup.classList.remove("open");
        
    }

    return (
        <>
            <Form className="form search" onSubmit={ e => onSubmit(e) }>
                    <InputGroup className="search-container" id="search-group">
                        <InputGroup.Text onClick={ () => onClickOpenSearch() }>
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
                        <Button className=" rounded-btn profile-btn close-btn" onClick={ () => onClickCloseSearch() }><BsXLg /></Button>
                    </InputGroup>   
                </Form>
        </>
    );

}