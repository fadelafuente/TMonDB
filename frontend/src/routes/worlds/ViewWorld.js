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
import '../../assets/styling/Banner.css';
import '../../assets/styling/Article.css';
import ArticleHeader from '../../components/ui/Article/ArticleHeader';

export default function ViewWorld() {
  const { query } = useOutletContext();
  const [world] = useGetResourceById('worlds');
  const [showBlock, setShowBlock] = useState(false);
  const [isDeleted, setIsDeleted] = useDeleteResource(false);
  const [tab, setTab] = useState('description');

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
                
                <div className='world-banner bottom-barrier'>
                </div>
                
                <article className='article-container'>
                  <ArticleHeader data={ world } type="World" setIsDeleted={ (d) => setIsDeleted(d) } setShowBlock={ (b) => setShowBlock(b) } />

                  <Tabs defaultActiveKey={ tab } activeKey={ tab } onSelect={(k) => setTab(k)} fill>
                    <Tab title='Description' eventKey='description'>
                      <p className='include-newlines'>{ world.description }</p>
                    </Tab>
                    <Tab title='Regions' eventKey='regions'>
                      <p>Region</p>
                    </Tab>
                  </Tabs>

                  <div className='mon-interactions'>
                    <SocialInteractions resource='worlds' obj={ world } />
                  </div>
                </article>

                <div className='reply-container'>
                  <ReplyBar parent={ world && world.article ? world.article.id : null } />
                </div>
                <div className='comments-container article-container'>
                  <PostArticles query={ query } kwargs={ { parent: world.article ? world.article.id : null } } />
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