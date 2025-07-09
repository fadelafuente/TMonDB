import { useOutletContext, useParams } from 'react-router-dom';

import PostArticles from '../../components/Articles/PostArticles';
import ReplyBar from '../../components/Bars/ReplyBar';
import { BlockedCard } from '../../components/Cards/BlockedCard';
import { DeletedCard } from '../../components/Cards/DeletedCard';
import { FailedCard } from '../../components/Cards/FailedCard';
import LoadingCard from '../../components/Cards/LoadingCard';
import PostCard from '../../components/Cards/PostCard';
import { useGetResourceById } from '../../hooks/api/use-get-resource-by-id';

import '../../assets/styling/content.css';
import '../../assets/styling/ViewPost.css';
import ParentCard from '../../components/Cards/ParentCard';

export default function ViewPost() {
  const { query } = useOutletContext();
  const { id } = useParams();
  const { data: post, isLoading } = useGetResourceById('posts', id);

  if(isLoading) {
    return (
      <div className='article-container'>
        <LoadingCard />
      </div>
    );
  }

  if(!post || post.detail === 'Post not found.') {
    return (
      <div className='article-container'>
        <FailedCard />
      </div>
    );
  }

  return (
    <>
      { post.current_user_is_blocked ?
        <div className='article-container'>
          <BlockedCard creator={ post.creator } />
        </div>
      :
        <div>
          { post.parent_deleted ?
            <div className='parent-container article-container'>
              <DeletedCard />
            </div>
          :  
            post.parent ?
              <ParentCard post={ post } />
            :
              <></>
          }
          <div className='article-container'>
            <PostCard post={ post } />
          </div>
          <div className='reply-container'>
            <ReplyBar parent={ post.article.id } />
          </div>
          <div className='comments-container article-container'>
            <PostArticles query={ query } kwargs={{ parent: post.article.id }} />
          </div>
        </div>
      }
    </>
  )
}