import { Form, InputGroup, Modal } from "react-bootstrap";
import SearchBar from "../SearchBar";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";

import '../../assets/styling/Modal.css';

export default function SearchModal({ setQuery, show, setShow }) {
    const [formData, setFormData] = useState("");

    const search = formData;

    function onSubmit(e) {
        e.preventDefault();
        setQuery(search);
        setShow(false);
    }

    return <>
        <Modal 
            className="search-modal" 
            backdrop="static" 
            backdropClassName="modal-backdrop" 
            show={ show } 
            onHide={ () => setShow(false) }
            size="lg" 
            centered
            fullscreen={true}
        >
            <Modal.Header closeButton closeVariant="white">
                <Form className="form search" onSubmit={ e => onSubmit(e) }>
                    <InputGroup 
                        className="search-container open" 
                        id="search-group"
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
            </Modal.Header>
            <Modal.Body>
            </Modal.Body>
        </Modal>
    </>
}