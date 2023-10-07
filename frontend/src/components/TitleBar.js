import { Col, Container, Dropdown, Row } from 'react-bootstrap';
import { BsPlus } from "react-icons/bs";
import { Link } from 'react-router-dom';

function TitleBar() {
    return (
        <div>
            <Container fluid className="title">
                <Row>
                    <Col>
                        <h1>The Monster Database</h1>
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
                <Link to="/FakeDB" className="appBar-text">Fakemon DB</Link>
                <Link to="/PokeDB" className="appBar-text">Pokemon DB</Link>
                <Link to="/FakeDB" className="appBar-text">Temtem DB</Link>
                <Link to="/FakeDB" className="appBar-text">Nexomon DB</Link>
                <input type="search" placeholder="Search..." />
            </nav>
        </div>
    );

}

export default TitleBar;