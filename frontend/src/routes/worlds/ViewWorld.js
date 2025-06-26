import { Fragment, useState } from 'react';
import { Col, Dropdown, DropdownButton, Row, Tab, Tabs } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { connect } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';

import PostArticles from '../../components/Articles/PostArticles';
import ReplyBar from '../../components/Bars/ReplyBar';
import { BlockedCard } from '../../components/Cards/BlockedCard';
import { FailedCard } from '../../components/Cards/FailedCard';
import LoadingCard from '../../components/Cards/LoadingCard';
import EvoChains from '../../components/Content/EvoChains';
import MovesTab from '../../components/Content/MovesTab';
import BlockModal from '../../components/Modals/BlockModal';
import StatChart from '../../components/TablesAndCharts/StatChart';
import WeaknessChart from '../../components/TablesAndCharts/WeaknessChart';
import SocialInteractions from '../../components/UserInteractions/SocialInteractions';
import { handleHeightConversion, handleKgToLbConversion, handleTimeDifference } from '../../functions/handlers';
import { useMiddleViewPort } from '../../hooks/misc/use-middle-viewport';
import { useDeleteResource } from '../../hooks/api/use-delete-resource';
import { useGetResourceById } from '../../hooks/api/use-get-resource-by-id';

import '../../assets/styling/content.css';
import '../../assets/styling/UserProfile.css';
import '../../assets/styling/ViewMon.css';

function ViewMon({ isAuthenticated }) {
    const { query } = useOutletContext();
     const [world] = useGetResourceById('worlds');
    const [showBlock, setShowBlock] = useState(false);
    const [aboveMid, setAboveMid] = useMiddleViewPort();
    const [isDeleted, setIsDeleted] = useDeleteResource(false);
    const [tab, setTab] = useState('stats');
    const navigate = useNavigate();

    if(isDeleted) {
        return <FailedCard />;
    } else {
        return (
            <>
                { world && typeof world === 'object' ?
                    world.current_user_is_blocked ?
                        <div className='article-container'>
                            <BlockedCard creator={world.creator} />
                        </div>
                    :
                        world.detail ? 
                            <div className='article-container'>
                                <FailedCard type="World" />
                            </div>
                            
                        :
                            <div>
                                <BlockModal show={showBlock} setShow={setShowBlock} setBlocked={() => window.location.reload()} username={ world ? world.article.creator.username : null } />
                                <div className='article-container'>
                                </div>
                            </div>
                :
                    <div className='article-container'>
                        <LoadingCard />
                    </div>
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(ViewMon);