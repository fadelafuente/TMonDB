import { Fragment } from 'react';
import { useOutletContext } from 'react-router-dom';

import { FailedCard } from '../Cards/FailedCard';
import LoadingCard from '../Cards/LoadingCard';
import PostCard from '../Cards/PostCard';
import useInfiniteScoll from '../../hooks/articles/use-infinite-scroll';
import { useGetResource } from '../../hooks/api/use-get-resource';

import '../../assets/styling/content.css';

export default function PostArticles({kwargs={}}) {
  const { query } = useOutletContext();
  const queryResult = useGetResource('posts', kwargs, query);
  const { data: posts, ref: lastPost, isFetching: loading, isFetchingNextPage } = useInfiniteScoll({ queryResult }, query, 'posts');

  if(loading && !isFetchingNextPage) {
    return (
      <LoadingCard />
    );
  }

  if(!posts || !posts?.pages || (posts.pages.length === 1 && posts.pages[0] === null)) {
    return <FailedCard />;
  }

  return (
    <>
      {
        posts.pages.map((page, index) => (
          page ?
            <Fragment key={ `page-${ index }` }>
              { 
                page['results'].map((post, index) => {
                  if(page['results'].length === index + 1) {
                    return <div key={ `post-${ post.id }` } ref={lastPost}><PostCard post={post} /></div>
                  } else {
                    return <div key={ `post-${ post.id }` }><PostCard post={post} /></div>
                  }
                })
              }
            </Fragment>
          : 
            <div key={ `page-${ index }` }></div>
        ))
      }
    </>
  )
}