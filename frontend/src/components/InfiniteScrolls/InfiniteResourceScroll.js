import { Fragment } from 'react';
import { useOutletContext } from 'react-router-dom';

import { FailedCard } from '../Cards/FailedCard';
import LoadingCard from '../Cards/LoadingCard';
import BaseCard from '../Cards/BaseCard';
import useInfiniteScoll from '../../hooks/articles/use-infinite-scroll';
import { useGetResource } from '../../hooks/features/api/use-get-resource';

import '../../assets/styling/content.css';

export default function InfiniteResourceScroll({ kwargs={}, type='posts', Card=BaseCard, label='Post' }) {
  const { query } = useOutletContext();
  const queryResult = useGetResource(type, kwargs, query);
  const { data: resources, ref: lastResource, isFetching: loading, isFetchingNextPage } = useInfiniteScoll({ queryResult }, query, type);

  if(loading && !isFetchingNextPage) {
    return (
      <div className='loading-container'>
        <LoadingCard />
      </div>
    );
  }

  if(!resources || !resources?.pages || (resources.pages.length === 1 && resources.pages[0] === null)) {
    return <FailedCard />;
  }

  return (
    <div className='col-gap-container'>
      {
        resources.pages.map((page, index) => (
          <Fragment key={ `page-${index}` }>
            { 
              page['results'].map((resource, index) => {
                if(page['results'].length === index + 1) {
                  return (
                    <div className='card card-outer-div' key={ `post-${resource.id}` } ref={ lastResource }>
                      { <Card data={ resource } type={ type } label={ label } /> }
                    </div>
                  )
                } else {
                  return (
                    <div className='card card-outer-div' key={ `post-${resource.id}` }>
                      { <Card data={ resource } type={ type } label={ label } /> }
                    </div>
                  )
                }
              })
            }
          </Fragment>
        ))
      }
    </div>
  )
}