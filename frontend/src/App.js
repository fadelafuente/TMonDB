import { Outlet, RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import Layout from './hocs/Layout';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import PostArticles from './components/Articles/PostArticles';
import Activate from './routes/auth/Activate';
import FacebookOauth from './routes/auth/FacebookOauth';
import GoogleOauth from './routes/auth/GoogleOauth';
import Login from './routes/auth/Login';
import LoginChange from './routes/auth/LoginChange';
import Register from './routes/auth/Register';
import ResetPasswordConfirm from './routes/auth/ResetPasswordConfirm';
import SetEmailConfirm from './routes/auth/SetEmailConfirm';
import SetUsername from './routes/auth/SetUsername';
import { SetUsernameConfirmation } from './routes/auth/SetUsernameConfirmation';
import VerifyEmail from './routes/auth/VerifyEmail';
import HomePage from './routes/HomePage';
import UpdateMon from './routes/monsters/UpdateMonster';
import ViewMon from './routes/monsters/ViewMonster';
import CreateMon from './routes/monsters/CreateMonster';
import ViewPost from './routes/posts/ViewPost';
import CreateType from './routes/types/CreateType';
import BlockingArticles from './routes/users/BlockingArticles';
import FollowContent from './routes/users/FollowContent';
import ProfileInfo from './routes/users/ProfileInfo';
import Account from './routes/users/Account';
import CreateWorld from './routes/worlds/CreateWorld';
import ViewWorld from './routes/worlds/ViewWorld';
import UpdateWorld from './routes/worlds/UpdateWorld';

import './assets/styling/App.css';

const queryClient = new QueryClient();

export default function App() {  
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={ <Root /> } >
      {/* Public Routes */}
      <Route path='register' element={ <Register /> } />
      <Route path='login' element={ <Login /> } />
      <Route path='verify' element={ <VerifyEmail/> } />
      <Route path='google-oauth' element={ <GoogleOauth /> } />
      <Route path='facebook-oauth' element={ <FacebookOauth /> } />
      
      {/* Authenticated Routes */}
      <Route path='activate/:uid/:token' element={ <Activate /> } />
      <Route path='reset_password' element={ <LoginChange /> } />
      <Route path='password/reset/confirm/:uid/:token' element={ <ResetPasswordConfirm /> } />
      <Route path='reset_email' element={ <LoginChange reset_type='email' /> } />
      <Route path='email/reset/confirm/:uid/:token' element={ <SetEmailConfirm /> } />
      <Route path='set_username' element={ <SetUsername /> } />
      <Route path='username/reset/confirm' element={ <SetUsernameConfirmation /> } />
      <Route path='types' element= { <CreateType /> } />

      {/* API Routes */}
      <Route path='' element={ <HomePage /> } >
        <Route path='' element= { <div className='article-container'><PostArticles /></div> } />

        <Route path='monsters'>
          {/* <Route path='' element= { <div className='article-container'><MonArticles query={ query } /></div> } /> */}
          <Route path='create' element={ <CreateMon /> } />
          <Route path=':id/update' element={ <UpdateMon /> } />
          <Route path=':id' element={ <ViewMon /> } />
        </Route>

        <Route path='regions'>
          {/* <Route path='' element= { <div className='article-container'><RegionArticles query={ query } /></div> } /> */}
        </Route>

        <Route path='settings'>
          <Route path='account' element={ <Account /> } />
          <Route path='blocked' element={ <BlockingArticles /> } />
        </Route>

        <Route path='worlds'>
          <Route path='create' element={ <CreateWorld /> } />
          <Route path=':id' element={ <ViewWorld /> } />
          <Route path=':id/update' element={ <UpdateWorld /> } />
        </Route>

        <Route path=':creator'>
          <Route path='' element= { <ProfileInfo /> } />
          <Route path='follow' element={ <FollowContent /> } />
          <Route path=':id' element={ <ViewPost /> } />
        </Route>
      </Route>
    </Route>
  ))

  return (
    <RouterProvider router={ router } />
  );
}

const Root = () => {
  return <> 
    <Layout>
      <div className='height-container'>
        <QueryClientProvider client={ queryClient }>
          <Outlet />
        </QueryClientProvider>
      </div>
    </Layout>
  </>
}

