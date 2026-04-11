import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import InfiniteResourceScroll from '../../../../../components/InfiniteScrolls/InfiniteResourceScroll';
import ReplyBar from '../../../../../components/Bars/ReplyBar';
import { BlockedCard } from '../../../../../components/Cards/BlockedCard';
import { FailedCard } from '../../../../../components/Cards/FailedCard';
import LoadingCard from '../../../../../components/Cards/LoadingCard';
import PostCard from '../../../../../components/Cards/PostCard';
import BlockModal from '../../../../../components/Modals/BlockModal';
import ArticleHeader from '../../../../../components/ui/Article/ArticleHeader';
import DeleteResourceModal from '../../../../../components/Modals/DeleteResourceModal';
import SocialInteractions from '../../../../../components/UserInteractions/SocialInteractions';
import { useGetResourceById } from '../../../../../hooks/features/api/use-get-resource-by-id';
import { useDeleteResourceModal } from '../../../../../hooks/modal/use-delete-resource-modal';

import '../../../../../assets/styling/content.css';
import '../../../../../assets/styling/UserProfile.css';
import '../../../../../assets/styling/ViewMon.css';
import '../../../../../assets/styling/Banner.css';
import '../../../../../assets/styling/Article.css';

export default function ViewWorldComponent() {
  const { id } = useParams();
  const { data: world, isLoading } = useGetResourceById('worlds', id);
  const [showBlock, setShowBlock] = useState(false);
  const { openDeleteModal, isDeleted, setOpenDeleteModal, handleDeleteResource} = useDeleteResourceModal('worlds', world);
  const [tab, setTab] = useState('description');

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
        <DeleteResourceModal
          show={ openDeleteModal }
          setShow={ setOpenDeleteModal }
          handleDelete={ handleDeleteResource }
          label='world'
        />
        {world.current_user_is_blocked ? (
          <div className='article-container'>
            <BlockedCard creator={ world.creator } />
          </div>
        ) : world.detail ? (
          <div className='article-container'>
            <FailedCard type='World' />
          </div>
        ) : (
          <div>
            <BlockModal
              show={ showBlock }
              setShow={ setShowBlock}
              setBlocked={ () => window.location.reload() }
              username={ world ? world.article.creator.username : null }
            />

            <div className='world-banner bottom-barrier'></div>

            <article className='article-container'>
              <ArticleHeader
                data={ world }
                type='World'
                setShowDelete={ (d) => setOpenDeleteModal(d) }
                setShowBlock={ (b) => setShowBlock(b) }
              />

              <Tabs
                defaultActiveKey={ tab }
                activeKey={ tab }
                onSelect={ (k) => setTab(k) }
                fill
              >
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
              <ReplyBar
                parent={ world && world.article ? world.article.id : null }
              />
            </div>
            <div className='comments-container article-container'>
              <InfiniteResourceScroll
                kwargs={{ parent: world.article ? world.article.id : null }}
                Card={ PostCard }
              />
            </div>
          </div>
        )}
      </>
    );
  }
}