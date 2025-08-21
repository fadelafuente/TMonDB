import { Outlet, RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import Layout from './hocs/Layout';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { Index } from './routes/(app)/_app.index.js';
import AppComponent from './routes/(app)/_app.js';
import AuthComponent from './routes/(auth)/_auth.js';
import { ResetComponent } from './routes/reset/reset.js';

import PublicAppComponent from './routes/(app)/(public)/_public.js';
import ProfileComponent from './routes/(app)/(public)/_public.$creator.js';
import ViewPostComponent from './routes/(app)/(public)/_public.$creator.$id.js';
import FollowComponent from './routes/(app)/(public)/_public.$creator.follow.js';
import ViewMonsterComponent from './routes/(app)/(public)/_public.db.monsters.$id.js';
import ViewWorldComponent from './routes/(app)/(public)/_public.db.worlds.$id.js';
import ViewRegionComponent from './routes/(app)/(public)/_public.db.regions.$id.js';

import PrivateAppComponent from './routes/(app)/(private)/_private.js';
import CreateMonsterComponent from './routes/(app)/(private)/db/monsters/create.js';
import UpdateMonsterComponent from './routes/(app)/(private)/db/monsters/$id.update.js';
import CreateTypeComponent from './routes/(app)/(private)/db/types/create.js';
import CreateWorldComponent from './routes/(app)/(private)/db/worlds/create.js';
import UpdateWorldComponent from './routes/(app)/(private)/db/worlds/$id.update.js';
import AccountComponent from './routes/(app)/(private)/settings/account.js';
import BlockedComponent from './routes/(app)/(private)/settings/blocked.js';

import ActivateComponent from './routes/(auth)/_auth.activate.$uid.$token.js';
import FacebookOauthComponent from './routes/(auth)/_auth.facebook-oauth.js';
import GoogleOauthComponent from './routes/(auth)/_auth.google-oauth.js';
import LoginComponent from './routes/(auth)/_auth.login.js';
import RegisterComponent from './routes/(auth)/_auth.register.js';
import VerifyEmailComponent from './routes/(auth)/_auth.verify.js';

import PrivateResetComponent from './routes/reset/(private)/_private.js';
import ResetEmailComponent from './routes/reset/(private)/_private.email.js';
import ResetEmailConfirmComponent from './routes/reset/(private)/_private.email.reset.confirm.$uid.$token.js';
import ResetUsernameComponent from './routes/reset/(private)/_private.username.js';
import { ResetUsernameConfirmComponent } from './routes/reset/(private)/_private.username.reset.confirm.js';
import PublicResetComponent from './routes/reset/(public)/_public.js';
import ResetPasswordComponent from './routes/reset/(public)/_public.password.js';
import ResetPasswordConfirmComponent from './routes/reset/(public)/_public.password.reset.confirm.$uid.$token.js';

import './assets/styling/App.css';

const queryClient = new QueryClient();

export default function App() {  
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={ <Root /> } >
      {/* API Routes */}
      <Route path='' element={ <AppComponent /> } >
        <Route path='' element= { <Index /> } />

        {/* Private Routes */}
        <Route path='' element={ <PrivateAppComponent /> }>
          <Route path='db'>
            <Route path='monsters'>
              <Route path='create' element={ <CreateMonsterComponent /> } />
              <Route path=':id/update' element={ <UpdateMonsterComponent /> } />
            </Route>

            <Route path='types'>
              <Route path='create' element={ <CreateTypeComponent /> } />
            </Route>

            <Route path='worlds'>
              <Route path='create' element={ <CreateWorldComponent /> } />
              <Route path=':id/update' element={ <UpdateWorldComponent /> } />
            </Route>
          </Route>

          <Route path='settings'>
            <Route path='account' element={ <AccountComponent /> } />
            <Route path='blocked' element={ <BlockedComponent /> } />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path='' element={ <PublicAppComponent /> }>
          <Route path=':creator' element={ <ProfileComponent /> } />
          <Route path=':creator/:id' element={ <ViewPostComponent /> } />
          <Route path=':creator/follow' element={ <FollowComponent /> } />

          <Route path='db/monsters/:id' element={ <ViewMonsterComponent /> } />
          <Route path='db/worlds/:id' element={ <ViewWorldComponent /> } />
          <Route path='db/regions/:id' element={ <ViewRegionComponent /> } />
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
      <Route path='reset' element={ <ResetComponent /> }>
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

