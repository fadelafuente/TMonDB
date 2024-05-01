import './assets/styling/App.css';
import Register from './pages/Register';
import { Outlet, RouterProvider, createBrowserRouter, 
  createRoutesFromElements, Route } from 'react-router-dom';
import Login from './pages/Login';
import Activate from './pages/Activate';
import LoginChange from './pages/LoginChange';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import GoogleOauth from './pages/GoogleOauth';
import FacebookOauth from './pages/FacebookOauth';
import VerifyEmail from './pages/VerifyEmail';
import HomePage from './pages/HomePage';
import Layout from './hocs/Layout';
import SetUsername from './pages/SetUsername';
import { SetUsernameConfirmation } from './pages/SetUsernameConfirmation';
import SetEmailConfirm from './pages/SetEmailConfirm';

import { Provider } from 'react-redux';
import store from './store';

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={ <Root /> } >
      <Route path="register" element={ <Register /> } />
      <Route path="login" element={ <Login /> } />
      <Route path="home" element={ <HomePage accessedContent="home" /> } />
      <Route path="verify" element={ <VerifyEmail/> } />
      <Route path="activate/:uid/:token" element={ <Activate /> } />
      <Route path="reset_password" element={ <LoginChange /> } />
      <Route path="password/reset/confirm/:uid/:token" element={ <ResetPasswordConfirm /> } />
      <Route path="reset_email" element={ <LoginChange reset_type="email" /> } />
      <Route path="email/reset/confirm/:uid/:token" element={ <SetEmailConfirm /> } />
      <Route path="google-oauth" element={ <GoogleOauth /> } />
      <Route path="facebook-oauth" element={ <FacebookOauth /> } />
      <Route path=":creator/:pid" element={ <HomePage accessedContent="post" /> } />
      <Route path="set_username" element={ <SetUsername /> } />
      <Route path="username/reset/confirm" element={ <SetUsernameConfirmation /> } />
      <Route path=":creator" element={ <HomePage accessedContent="user" /> } />
      <Route path="settings/account" element={ <HomePage accessedContent="account" /> } />
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

