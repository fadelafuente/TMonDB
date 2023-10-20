import { Container, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { BsPlusCircle, BsPersonCircle, BsSearch } from 'react-icons/bs';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

import "../assets/styling/forms.css";
import "../assets/styling/App.css";

function TitleBar() {
    return (
        <Navbar expand="bg-body-tertiary mb-3">
            <Container>
                <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" id="navbar-toggler" className="navbar-dark" />
                <Navbar.Brand href="#home">The Monster Database</Navbar.Brand>
                <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-lg"
                    aria-labelledby="offcanvasNavbarLabel-expand-lg"
                    placement="start"
                >
                    <Offcanvas.Header closeButton closeVariant="white">
                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                        The Monster Database
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Trending</Nav.Link>
                        <Nav.Link href="#link">Monsters</Nav.Link>
                        <Nav.Link href="#link">Regions</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>
                <Form className="form search">
                    <InputGroup>
                    <InputGroup.Text>
                        <BsSearch />
                    </InputGroup.Text>
                    <Form.Control type="search" className="me-2 search" placeholder="Search" />
                    </InputGroup>   
                </Form>
                <NavDropdown title={ <BsPlusCircle /> } id="nav-dropdown" className="rounded-circle" drop="down" align="end">
                    <NavDropdown.Item href="#action/3.1">
                        Create Region
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Create Monster
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                        Create Type
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Create Move
                    </NavDropdown.Item>
                </NavDropdown> 
                <NavDropdown title={ <BsPersonCircle /> } id="nav-dropdown" className="rounded-circle" drop="down" align="end">
                    <NavDropdown.Item href="#action/3.1">
                        Account
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        My Regions
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                        My Monsters
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Settings
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                        Logout
                    </NavDropdown.Item>
                </NavDropdown> 
            </Container>
        </Navbar>
    );

}

export default TitleBar;