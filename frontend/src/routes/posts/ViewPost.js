import { useOutletContext } from 'react-router-dom';

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

export default function ViewPost() {
  const { query } = useOutletContext();
  const [post, parent] = useGetResourceById('posts');

  return (
    <>
      { post && typeof post === 'object' ? 
        post.current_user_is_blocked ?
          <div className='article-container'>
            <BlockedCard creator={post.creator} />
          </div>
        :
          post.detail === 'Post not found.' ? 
            <div className='article-container'>
              <FailedCard />
            </div>
          :
            <div>
              { post.parent_deleted ?
                <div className='parent-container article-container'>
                  <DeletedCard />
                </div>
              :  
                parent ? 
                  <div className='parent-container article-container'>
                    <PostCard post={parent} />
                  </div>
                : 
                  ''
              }
              <div className='article-container'>
                <PostCard post={post} />
              </div>
              <div className='reply-container'>
                <ReplyBar parent={post.article.id} />
              </div>
              <div className='comments-container article-container'>
                <PostArticles query={ query } kwargs={ {parent: post.article.id} } />
              </div>
            </div>
      : 
        <div className='article-container'>
            <LoadingCard />
        </div>
      }
    </>
  )
}