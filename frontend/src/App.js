import { Outlet, RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import Layout from './hocs/Layout';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { Index } from './routes/(app)/_app.index.js';

import AuthComponent from './routes/(auth)/_auth';
import ActivateComponent from './routes/(auth)/_auth.activate.$uid.$token.js';
import FacebookOauthComponent from './routes/(auth)/_auth.facebook-oauth.js';
import GoogleOauthComponent from './routes/(auth)/_auth.google-oauth.js';
import LoginComponent from './routes/(auth)/_auth.login.js';
import RegisterComponent from './routes/(auth)/_auth.register.js';
import VerifyEmailComponent from './routes/(auth)/_auth.verify.js';

import { Reset } from './routes/reset/reset.js';
import PrivateResetComponent from './routes/reset/(private)/_private.js';
import ResetEmailComponent from './routes/reset/(private)/_private.email.js';
import ResetEmailConfirmComponent from './routes/reset/(private)/_private.email.reset.confirm.$uid.$token.js';
import ResetUsernameComponent from './routes/reset/(private)/_private.username.js';
import { ResetUsernameConfirmComponent } from './routes/reset/(private)/_private.username.reset.confirm.js';
import PublicResetComponent from './routes/reset/(public)/_public.js';
import ResetPasswordComponent from './routes/reset/(public)/_public.password.js';
import ResetPasswordConfirmComponent from './routes/reset/(public)/_public.password.reset.confirm.$uid.$token.js';


import UpdateMon from './routes/monsters/UpdateMonster';
import ViewMon from './routes/monsters/ViewMonster';
import CreateMon from './routes/monsters/CreateMonster';
import CreateType from './routes/types/CreateType';
import BlockingArticles from './routes/users/BlockingArticles';
import Account from './routes/users/Account';
import CreateWorld from './routes/worlds/CreateWorld';
import ViewWorld from './routes/worlds/ViewWorld';
import UpdateWorld from './routes/worlds/UpdateWorld';

import './assets/styling/App.css';
import AppComponent from './routes/(app)/_app.js';
import PrivateAppComponent from './routes/(app)/(private)/_private.js';
import PublicAppComponent from './routes/(app)/(public)/_public.js';
import ProfileComponent from './routes/(app)/(public)/_public.$creator.js';
import ViewPostComponent from './routes/(app)/(public)/_public.$creator.$id.js';
import FollowComponent from './routes/(app)/(public)/_public.$creator.follow.js';

const queryClient = new QueryClient();

export default function App() {  
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={ <Root /> } >
      {/* API Routes */}
      <Route path='' element={ <AppComponent /> } >
        <Route path='' element= { <Index /> } />

        <Route path='' element={ <PrivateAppComponent /> }>
        </Route>

        <Route path='' element={ <PublicAppComponent /> }>
          <Route path=':creator' element={ <ProfileComponent /> } />
          <Route path=':creator/:id' element={ <ViewPostComponent /> } />
          <Route path=':creator/follow' element={ <FollowComponent /> } />
        </Route>

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

        <Route path='types'>
          <Route path='create' element= { <CreateType /> } />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route path='' element={ <AuthComponent /> }>
        <Route path='register' element={ <RegisterComponent /> } />
        <Route path='login' element={ <LoginComponent /> } />
        <Route path='verify' element={ <VerifyEmailComponent/> } />
        <Route path='google-oauth' element={ <GoogleOauthComponent /> } />
        <Route path='facebook-oauth' element={ <FacebookOauthComponent /> } />        
        <Route path='activate/:uid/:token' element={ <ActivateComponent /> } />
      </Route>

      {/* Reset Password/Username/Email Routes */}
      <Route path='reset' element={ <Reset /> }>
        <Route path='' element={ <PrivateResetComponent /> }>
          <Route path='email' element={ <ResetEmailComponent /> } />
          <Route path='email/confirm/:uid/:token' element={ <ResetEmailConfirmComponent /> } />
          <Route path='username' element={ <ResetUsernameComponent /> } />
          <Route path='username/confirm' element={ <ResetUsernameConfirmComponent /> } />
        </Route>

        <Route path='' element={ <PublicResetComponent /> }>
          <Route path='password' element={ <ResetPasswordComponent /> } />
          <Route path='password/confirm/:uid/:token' element={ <ResetPasswordConfirmComponent /> } />
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

