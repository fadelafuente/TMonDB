import { Fragment } from 'react';
import { useOutletContext } from 'react-router-dom';

import { FailedCard } from '../Cards/FailedCard';
import LoadingCard from '../Cards/LoadingCard';
import MonsterCard from '../Cards/MonsterCard';
import { useGetResource } from '../../hooks/api/use-get-resource';
import useInfiniteScoll from '../../hooks/articles/use-infinite-scroll';

import '../../assets/styling/content.css';

export default function MonsterArticles({kwargs={}}) {
  const { query } = useOutletContext();
  const queryResult = useGetResource('monsters', kwargs, query);
  const { data: monsters, ref: lastMonster, isFetching: loading, isFetchingNextPage } = useInfiniteScoll({ queryResult }, query, 'monsters');

  if(loading && !isFetchingNextPage) {
    return (
      <LoadingCard />
    );
  }

  if(!monsters || !monsters?.pages || (monsters.pages.length === 1 && monsters.pages[0] === null)) {
    return <FailedCard />;
  }

  return (
    <div className='col-gap-container'>
      {
        monsters.pages.map((page, index) => (
          <Fragment key={ `page-${ index }` }>
            {
              page['results'].map((monster, index) => {
                if(monsters.length === index + 1) {
                  return <div className='mon-article' key={ `monster-${monster.id}` } ref={ lastMonster }><MonsterCard monster={ monster } /></div>
                } else {
                  return <div className='mon-article' key={ `monster-${monster.id}` }><MonsterCard monster={ monster } /></div>
                }
              })
            }
          </Fragment>
        ))
      }
    </div>
  )
}