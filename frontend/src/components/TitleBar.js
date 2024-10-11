import { React, Fragment, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BsPlusCircle, BsPersonCircle } from 'react-icons/bs';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import CreatePost from './Creates/CreatePost';
import SearchBar from './SearchBar';

import "../assets/styling/forms.css";
import "../assets/styling/App.css";

function TitleBar({setQuery, logout, isAuthenticated, user }) {
    const [show, setShow] = useState(false);
    const [width, setWidth] = useState(window.innerWidth <= 700);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth <= 700);
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function guestLinks() {
        return (
            <Fragment>
                <NavDropdown title={ <BsPersonCircle /> } id="nav-dropdown" className="rounded-circle" drop="down" align="end">
                    <NavDropdown.Item href="/login">
                        Login
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/register">
                        Register
                    </NavDropdown.Item>
                </NavDropdown>
            </Fragment>
        )
    };

    function authLinks() {
        return (
            <Fragment>
                <NavDropdown title={ <BsPlusCircle /> } id="nav-dropdown" className="rounded-circle" drop="down" align="end">
                    <NavDropdown.Item href="#action/3.1">
                        Create Region
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Create Monster
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/types">
                        Create Type
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Create Move
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#" onClick={() => setShow(true) }>
                        Create Post
                    </NavDropdown.Item>
                </NavDropdown> 
                <NavDropdown title={ <BsPersonCircle /> } id="nav-dropdown" className="rounded-circle" drop="down" align="end">
                    <NavDropdown.Item href={ user ? `/${user.username}` : "/home" }>
                        Account
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        My Regions
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                        My Monsters
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/settings/account">
                        Settings
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/home" onClick={ () => logout() }>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </Fragment>
        )
    }

    return (
        <Navbar expand="bg-body-tertiary mb-3" id="navbar">
            <Container>
                { width ? 
                    <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" id="navbar-toggler" className="navbar-dark" />
                :
                    <Navbar.Brand href="/home">The Monster Database</Navbar.Brand>
                }
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
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="#for-you">For You</Nav.Link>
                            <Nav.Link href="#home">Trending</Nav.Link>
                            <Nav.Link href="#link">Monsters</Nav.Link>
                            <Nav.Link href="#link">Regions</Nav.Link>
                            { isAuthenticated && user ?
                                <Nav.Link href={ `/${user.username}` }>Account</Nav.Link>
                                :
                                ""
                            }
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
                <SearchBar setQuery={ setQuery } width={ width } />
                { isAuthenticated ? authLinks() : guestLinks() }
            </Container>
            <CreatePost show={show} setShow={() => setShow()} />
        </Navbar>
    );

}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(TitleBar);