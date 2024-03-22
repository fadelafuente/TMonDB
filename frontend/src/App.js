import './assets/styling/App.css';
import Register from './pages/Register';
import { Outlet, RouterProvider, createBrowserRouter, 
  createRoutesFromElements, Route } from 'react-router-dom';
import Login from './pages/Login';
import Activate from './pages/Activate';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import GoogleOauth from './pages/GoogleOauth';
import FacebookOauth from './pages/FacebookOauth';
import VerifyEmail from './pages/VerifyEmail';
import HomePage from './pages/HomePage';

import { Provider } from 'react-redux';
import store from './store';

import Layout from './hocs/Layout';
import ViewPost from './components/ViewPost';
import SetUsername from './pages/SetUsername';
import { SetUsernameConfirmation } from './pages/SetUsernameConfirmation';

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={ <Root /> } >
      <Route path="register" element={ <Register /> } />
      <Route path="login" element={ <Login /> } />
      <Route path="home" element={ <HomePage /> } />
      <Route path="verify" element={ <VerifyEmail/> } />
      <Route path="activate/:uid/:token" element={ <Activate /> } />
      <Route path="reset_password" element={ <ResetPassword /> } />
      <Route path="password/reset/confirm/:uid/:token" element={ <ResetPasswordConfirm /> } />
      <Route path="google-oauth" element={ <GoogleOauth /> } />
      <Route path="facebook-oauth" element={ <FacebookOauth /> } />
      <Route path=":creator/:pid" element={ <ViewPost /> } />
      <Route path="set_username" element={ <SetUsername /> } />
      <Route path="username/reset/confirm" element={ <SetUsernameConfirmation /> } />
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

