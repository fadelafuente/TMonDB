import { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';

import TitleBar from '../components/Bars/TitleBar';
import { useCurrentUserDetails } from '../hooks/hooks';

import '../assets/styling/content.css';
import '../assets/styling/buttons.css';
import '../assets/styling/container.css';

function HomePage({ isAuthenticated }) {
    const [query, setQuery] = useState('');
    const [user] = useCurrentUserDetails(isAuthenticated);
    const location = useLocation();

    return (
        <>
            <div className='navbar-container'>
                <TitleBar setQuery={(value) => setQuery(value)} user={user} />
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
                <div id='content-center' className='content-center'>
                    <Outlet context={{ user: user, query: query }} />
                </div>
                <div className='aside-container right-aside' id='right-container'>
                    <div className='right-container'>
                        <div id='sticky-anchor'></div>
                        <div className='content-right'>
                            {location.pathname.includes('/settings/') ? 
                                <div className='align-col'>
                                    <button className='svg-btn square-no-border-btn' onClick={() => {window.history.replaceState(null, '', '/settings/account'); window.location.reload();} }>Account</button> 
                                    <button className='svg-btn square-no-border-btn' onClick={() => {window.history.replaceState(null, '', '/settings/blocked'); window.location.reload();} }>Blocked List</button> 
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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(HomePage);