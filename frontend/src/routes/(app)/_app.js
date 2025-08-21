import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import TitleBar from '../../components/Bars/TitleBar';
import LoadingCard from '../../components/Cards/LoadingCard';
import { useAuth } from '../../hooks/features/user/auth/use-auth';
import { useGetUser } from '../../hooks/features/user/use-get-user';

import '../../assets/styling/content.css';
import '../../assets/styling/buttons.css';
import '../../assets/styling/container.css';

export default function AppComponent() {
  const [query, setQuery] = useState('');
  const { data: isAuthenticated, isLoading } = useAuth();
  const { data: user, isLoading: userLoading } = useGetUser();
  const location = useLocation();

  if(isLoading || userLoading) {
    return (
      <div className='loading-container'>
        <LoadingCard />
      </div>
    );
  }

  return (
    <>
      <div className='navbar-container'>
        <TitleBar setQuery={ (value) => setQuery(value) } user={ user } isAuthenticated={ isAuthenticated } />
      </div>
      <div className='content-container center-content'>
        <div className='aside-container left-aside' id='left-container'>
          <div id='sticky-anchor'></div>
          <div className='content-left'>
            <div className='navigation-links'>
              <Link to='/'>For You</Link>
              <Link to='/'>Trending</Link>
              <Link to='/'>Monsters</Link>
              <Link to='/'>Regions</Link>
              { user ? <Link to={ `/${user.username}` }>Account</Link> : '' }
            </div>
          </div>
        </div>
        <div id='content-center' className='content-center max-height-container max-width-container'>
          <Outlet context={{ user, query, isAuthenticated }} />
        </div>
        <div className='aside-container right-aside' id='right-container'>
          <div className='right-container'>
            <div id='sticky-anchor'></div>
            <div className='content-right'>
              {location.pathname.includes('/settings/') ?
                <div className='align-col'>
                  <button className='svg-btn square-no-border-btn' onClick={ () => {window.history.replaceState(null, '', '/settings/account'); window.location.reload();} }>Account</button>
                  <button className='svg-btn square-no-border-btn' onClick={ () => {window.history.replaceState(null, '', '/settings/blocked'); window.location.reload();} }>Blocked List</button>
                </div>
                : 'Right'
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}