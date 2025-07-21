
import { Fragment } from 'react';
import { FailedCard } from './Cards/FailedCard';
import FollowCard from './Cards/FollowCard';
import LoadingCard from './Cards/LoadingCard';
import useInfiniteScoll from '../hooks/articles/use-infinite-scroll';
import { useFollowList } from '../hooks/profile/use-follow-list';

import '../assets/styling/content.css';

export default function FollowList({username, follow_type, query}) {
  const queryResult = useFollowList(username, follow_type, query);
  const { data: users, ref: lastUser, isFetching, isFetchingNextPage } = useInfiniteScoll({ queryResult }, query, follow_type);

  if(isFetching && !isFetchingNextPage) {
    return (
      <LoadingCard />
    );
  }

  if(!users || !users?.pages || (users.pages.length === 1 && users.pages[0] === null)) {
    return <FailedCard />;
  }

  return (
    <>
      {   
        users.pages.map((page, index) => (
          <Fragment key={ `page-${ index }` }>
            {
              page['results'].map((user, index) => {
                if(users.length === index + 1) {
                  return <div key={user.id} ref={lastUser}><FollowCard user={user} /></div>
                } else {
                  return <div key={user.id}><FollowCard user={user} /></div>
                }
              })
            }
          </Fragment>
        ))
      }
    </>
  )
}