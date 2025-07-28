import { Fragment } from 'react';
import { useOutletContext } from 'react-router-dom';

import BlockingCard from '../../components/Cards/BlockingCard';
import { FailedCard } from '../../components/Cards/FailedCard';
import LoadingCard from '../../components/Cards/LoadingCard';
import useInfiniteScoll from '../../hooks/articles/use-infinite-scroll';
import { useBlockList } from '../../hooks/profile/use-block-list';

import '../../assets/styling/content.css';

export default function BlockingArticles() {
    const { query } = useOutletContext();
    const queryResult = useBlockList(query);
    const { data: blocks, ref: lastBlock, isFetching: loading, isFetchingNextPage } = useInfiniteScoll({ queryResult }, query, 'block');

    if(loading && !isFetchingNextPage) {
      return (
        <div className='loading-article-container'>
          <LoadingCard />
        </div>
      );
    }
  
    if(!blocks || !blocks?.pages || (blocks.pages.length === 1 && blocks.pages[0] === null)) {
      return <FailedCard />;
    }

  return (
    <>
      {   
        blocks.pages.map((page, index) => (
          <Fragment key={ `page-${ index }` }>
            {
              page['results'].map((user, index) => {
                if(blocks.length === index + 1) {
                  return <div key={ `blocked-${user.id}` } ref={ lastBlock }><BlockingCard user={ user } /></div>
                } else {
                  return <div key={ `blocked-${user.id}` }><BlockingCard user={ user } /></div>
                }
              })
            }
          </Fragment>
        ))
      }
    </>
  )
}