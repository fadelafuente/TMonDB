import '../App.css';
import firebase from "../firebase";
import { Row, Container, Col } from 'react-bootstrap';
import RegionList from './RegionsList';
import React from 'react';

class CreateFakemon extends React.Component {
    // Declaring variables
    constructor() {
        super();
        this.state = {
          name: "",
          typings: [{ name: "" }, { name: ""}],
          region: "default",
          dexNo: 1,
          moveSet: [{ name: "" }],
          species: "",
          abilities: [{ name: "" }],
          dexEntry: "",
          baseStats: "",
          eggGroup: "",
          evoChain: [{ name: "" }]
        };
    }

    // function used to keep track of the values within the form
    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // Change the value (name) of a typing
    handleTypingChange = idx => evt => {
        const newTypings = this.state.typings.map((typing, sidx) => {
            if (idx !== sidx) return typing;
            return { ...typing, name: evt.target.value };
        });

        this.setState({ typings: newTypings });
    };

  render() {
    return (
        <div className="screen">
            <section className="body">
                <h1>New Fakemon</h1><br/>

                <form>
                    <Container>
                        <Row>
                            <p>Name:&#9;</p>
                            <input
                                type="text"
                                name="name"
                                placeholder="Fakemon name"
                                onChange={this.updateInput}
                                value={this.state.name}
                            />
                        </Row>

                        <Row>
                            <p>Typing 1</p>
                            <select onChange={this.handleTypingChange(0)}>
                                <option value="Fire">Fire</option>
                                <option value="Water">Water</option>
                            </select>

                            <p>Typing 2</p>
                            <select onChange={this.handleTypingChange(1)}>
                                <option value="none">No Secondary</option>
                                <option value="Fire">Fire</option>
                                <option value="Water">Water</option>

                            </select>
                        </Row>

                        <Row>
                            <p>Native Region:</p>
                            <select onChange={this.handleTypingChange(0)}>
                                <RegionList />
                            </select>
                        </Row>
                    </Container>
                </form>
            </section>
        </div>
      );
  }
}

export default CreateFakemon;