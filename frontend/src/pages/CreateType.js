import TitleBar from "../components/TitleBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useCurrentUserDetails, useNavigateNotAuth } from "../hooks/hooks";
import { connect } from "react-redux";
import { Button, Card } from "react-bootstrap";
import { BsArrowLeft, BsXCircle } from "react-icons/bs";

import "../assets/styling/content.css";
import "../assets/styling/types.css";

function CreateType({ isAuthenticated }) {
    const [query, setQuery] = useState("");
    const [user] = useCurrentUserDetails(isAuthenticated);
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    useNavigateNotAuth(isAuthenticated);

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
                                Create New Type
                            </h4>
                        </div>
                    </Card.Header>
                    <Card.Body className='deleted-icon'>
                        <BsXCircle/>
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