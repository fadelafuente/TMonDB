import TitleBar from "../components/TitleBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentUserDetails, useNavigateNotAuth } from "../hooks/hooks";
import { connect } from "react-redux";
import { Button, Card } from "react-bootstrap";
import { BsArrowLeft, BsDashCircle, BsPlus, BsPlusCircle } from "react-icons/bs";

import "../assets/styling/content.css";
import "../assets/styling/types.css";

function CreateType({ isAuthenticated }) {
    const [query, setQuery] = useState("");
    const [user] = useCurrentUserDetails(isAuthenticated);
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [newType, setNewType] = useState("");
    useNavigateNotAuth(isAuthenticated);

    function addType(t) {
        if(types.length >= 20)
            return;
        if(!types.includes(t))
            setTypes([...types, t]);
        setNewType("");
    }

    function deleteType(n) {
        const removed = [...types].filter((t) => t !== n);
        setTypes(removed);
    }

    return (
        <>
            <div className="navbar-container">
                <TitleBar setQuery={(value) => setQuery(value)} user={user} />
            </div>
            <div className="content-container center-content">
                <div id="content-center" className="content-center">
                <Card>
                    <Card.Header>
                        <div className="types-header">
                            <Button className="svg-btn media-btn center-content" onClick={ () => navigate(-1) }>
                                <BsArrowLeft/>
                            </Button>
                            <h4 className="types-h4">
                                Create New Type(s)
                            </h4>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="type-list">
                            {
                                Array.from(types, type => (
                                    <div className="type-row">
                                        <div className="type-name">
                                            {type}
                                        </div>
                                        <Button className="svg-btn types-btn remove-btn" onClick={ () => deleteType(type) }>
                                            <BsDashCircle />
                                        </Button>
                                    </div>
                                ))
                            }
                            <div className="type-add">
                                <input className="type-input" onChange={ e => setNewType(e.target.value) } value={ newType } />
                                <Button className="svg-btn types-btn" onClick={ () => addType(newType) }>
                                    <BsPlusCircle/>
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                    <Card.Footer className="types-footer">
                        <Button 
                            className="rounded-btn close-btn" 
                            id="discard-post-btn"
                            onClick={ () => navigate(-1) }
                        >
                            Cancel
                        </Button>
                        <Button className="rounded-btn" onClick={e => {}}>
                            Create
                        </Button>
                    </Card.Footer>
                </Card>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(CreateType);