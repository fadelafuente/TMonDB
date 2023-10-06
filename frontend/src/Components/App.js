import '../App.css';
import React from 'react';
import PokeDB from './PokeDB';
import FakeDB from './FakeDB';
import CreateFakemon from './CreateFakemon';
import CreateRegion from './CreateRegion';
import { Route, Routes, Link } from 'react-router-dom';
import { BsPlus } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import axios from 'axios';

class App extends React.Component {
    state = {details: [],};
    componentDidMount() {
        let data;
        axios.get(process.env.REACT_APP_DJANGO_URL)
        .then(res => {
            data = res.data;
            this.setState({
                details: data
            });
        })
        .catch(err => { })
    }

    render() {
        return (
            <div>
                <Container fluid className="title">
                    <Row>
                        <Col>
                            <h1>TFDB</h1>
                        </Col>
    
                        <Col>
                            <Dropdown className="dropdown">
                                <Dropdown.Toggle id="dropdown" className="dropdown-button">
                                </Dropdown.Toggle>
    
                                <Dropdown.Menu className="dropdown-content">
                                    <Dropdown.Item href="/">Account</Dropdown.Item>
                                    <Dropdown.Item href="/">My Regions</Dropdown.Item>
                                    <Dropdown.Item href="/">My Fakemon</Dropdown.Item>
                                    <Dropdown.Item href="/">Settings</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
    
                            <Dropdown className="dropdown">
                                <Dropdown.Toggle id="dropdown" className="dropdown-button">
                                    <BsPlus/>
                                </Dropdown.Toggle>
    
                                <Dropdown.Menu className="dropdown-content">
                                    <Dropdown.Item href="/CreateRegion" >New Region</Dropdown.Item>
                                    <Dropdown.Item href="/CreateFakemon">New Fakemon</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Container>
    
                <nav className="appBar" >
                    <a>
                    <Link to="/FakeDB" className="appBar-text">Fakemon DB</Link>
                    </a>
                    <a>
                    <Link to="/PokeDB" className="appBar-text">Pokemon DB</Link>
                    </a>
                    <a>
                    <Link to="/FakeDB" className="appBar-text">Temtem DB</Link>
                    </a>
                    <a>
                    <Link to="/FakeDB" className="appBar-text">Nexomon DB</Link>
                    </a>
                    <input type="search" placeholder="Search..." />
                </nav>
    
                <Routes>
                    <Route exact path="/" component={FakeDB} />
                    <Route exact path="/PokeDB" component={PokeDB} />
                    <Route exact path="/FakeDB" component={FakeDB} />
                    <Route exact path="/CreateRegion" component={CreateRegion} />
                    <Route exact path="/CreateFakemon" component={CreateFakemon} />
                </Routes>
    
                <div>
                    <header>Data Generated from Django</header>
                    <hr></hr>
                    {this.state.details.map((output, id) => 
                        <div key={id}>
                            <div>
                                <h2>{output.name}</h2>
                                <h3>{output.species}</h3>
                                <h3>{output.abilities}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
};

export default App;