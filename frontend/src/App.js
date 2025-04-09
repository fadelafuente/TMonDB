import { Provider } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import Layout from './hocs/Layout';
import Account from './components/Account';
import BlockingArticles from './components/Articles/BlockingArticles';
import PostArticles from './components/Articles/PostArticles';
import CreateMon from './components/Creates/CreateMon';
import CreateType from './components/Creates/CreateType';
import FollowContent from './components/Content/FollowContent';
import ProfileInfo from './components/ProfileInfo';
import UpdateMon from './components/Updates/UpdateMon';
import ViewMon from './components/ViewMon';
import ViewPost from './components/ViewPost';
import Activate from './pages/Activate';
import FacebookOauth from './pages/FacebookOauth';
import GoogleOauth from './pages/GoogleOauth';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import LoginChange from './pages/LoginChange';
import Register from './pages/Register';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import SetEmailConfirm from './pages/SetEmailConfirm';
import SetUsername from './pages/SetUsername';
import { SetUsernameConfirmation } from './pages/SetUsernameConfirmation';
import VerifyEmail from './pages/VerifyEmail';
import store from './store';


import './assets/styling/App.css';

export default function App() {  
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={ <Root /> } >
      <Route path='register' element={ <Register /> } />
      <Route path='login' element={ <Login /> } />
      <Route path='verify' element={ <VerifyEmail/> } />
      <Route path='activate/:uid/:token' element={ <Activate /> } />
      <Route path='reset_password' element={ <LoginChange /> } />
      <Route path='password/reset/confirm/:uid/:token' element={ <ResetPasswordConfirm /> } />
      <Route path='reset_email' element={ <LoginChange reset_type='email' /> } />
      <Route path='email/reset/confirm/:uid/:token' element={ <SetEmailConfirm /> } />
      <Route path='google-oauth' element={ <GoogleOauth /> } />
      <Route path='facebook-oauth' element={ <FacebookOauth /> } />
      <Route path='set_username' element={ <SetUsername /> } />
      <Route path='username/reset/confirm' element={ <SetUsernameConfirmation /> } />
      <Route path='types' element= { <CreateType /> } />
      <Route path='' element={ <HomePage /> } >
        <Route path='' element= { <div className='article-container'><PostArticles /></div> } />
      </Route>
      <Route path=':creator' element={ <HomePage /> } >
        <Route path='' element= { <ProfileInfo /> } />
        <Route path='follow' element={ <FollowContent /> } />
        <Route path=':id' element={ <ViewPost /> } />
      </Route>
      <Route path='monsters' element={ <HomePage /> } >
        {/* <Route path='' element= { <div className='article-container'><MonArticles query={ query } /></div> } /> */}
        <Route path='create' element={ <CreateMon /> } />
        <Route path=':id/update' element={ <UpdateMon /> } />
        <Route path=':id' element={ <ViewMon /> } />
      </Route>
      <Route path='regions' element={ <HomePage /> } >
        {/* <Route path='' element= { <div className='article-container'><RegionArticles query={ query } /></div> } /> */}
      </Route>
      <Route path='settings' element={ <HomePage /> }>
        <Route path='account' element={ <Account /> } />
        <Route path='blocked' element={ <BlockingArticles /> } />
      </Route>
    </Route>
  ))

  return (
    <Provider store={ store }>
        <RouterProvider router={router} />
    </Provider>
  );
}

const Root = () => {
  return <> 
    <Layout>
      <div>
        <Outlet />
      </div>
    </Layout>
  </>
}

