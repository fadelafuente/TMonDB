import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import PostArticles from '../../components/Articles/PostArticles';
import ReplyBar from '../../components/Bars/ReplyBar';
import { BlockedCard } from '../../components/Cards/BlockedCard';
import { FailedCard } from '../../components/Cards/FailedCard';
import LoadingCard from '../../components/Cards/LoadingCard';
import BlockModal from '../../components/Modals/BlockModal';
import ArticleHeader from '../../components/ui/Article/ArticleHeader';
import DeleteResourceModal from '../../components/Modals/DeleteResourceModal';
import SocialInteractions from '../../components/UserInteractions/SocialInteractions';
import { useDeleteResource } from '../../hooks/features/api/use-delete-resource';
import { useGetResourceById } from '../../hooks/features/api/use-get-resource-by-id';

import '../../assets/styling/content.css';
import '../../assets/styling/UserProfile.css';
import '../../assets/styling/ViewMon.css';
import '../../assets/styling/Banner.css';
import '../../assets/styling/Article.css';

export default function ViewWorld() {
  const { id } = useParams();
  const { data: world, isLoading } = useGetResourceById('worlds', id);
  const [showBlock, setShowBlock] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { data: isDeleted, mutate: setIsDeleted } = useDeleteResource('worlds');
  const [tab, setTab] = useState('description');

  function handleDelete() {
    setShowDelete(() => {
      setIsDeleted(world.id);
      return false;
    })
  }

  if(isLoading) {
    return (
      <div className='article-container'>
        <LoadingCard />
      </div>
    );
  }

  if(isDeleted) {
    return (
      <div className='article-container'>
        <FailedCard type='World' />
      </div>
    );
  } else {
    return (
      <>
        <DeleteResourceModal show={ showDelete } setShow={ setShowDelete } handleDelete={ handleDelete } />
        { world.current_user_is_blocked ?
          <div className='article-container'>
            <BlockedCard creator={ world.creator } />
          </div>
        :
          world.detail ? 
            <div className='article-container'>
              <FailedCard type='World' />
            </div>
          :
            <div>
              <BlockModal show={ showBlock } setShow={ setShowBlock } setBlocked={ () => window.location.reload() } username={ world ? world.article.creator.username : null } />
              
              <div className='world-banner bottom-barrier'>
              </div>
              
              <article className='article-container'>
                <ArticleHeader data={ world } type='World' setShowDelete={ d => setShowDelete(d) } setShowBlock={ (b) => setShowBlock(b) } />

                <Tabs defaultActiveKey={ tab } activeKey={ tab } onSelect={ (k) => setTab(k) } fill>
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
                <PostArticles kwargs={ { parent: world.article ? world.article.id : null } } />
              </div>
            </div>
        }
      </>
    );
  }
}