import './assets/styling/App.css';
import Register, { action as registerAction } from './pages/Register';
import Login, { action as loginAction } from './pages/Login'
import { Outlet, RouterProvider, createBrowserRouter, 
  createRoutesFromElements, Route } from 'react-router-dom';
import Trending from './pages/Trending';
import Activate from './pages/Activate';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';

import { Provider } from 'react-redux';
import store from './store';

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="register" element={<Register />} action={registerAction} />
      <Route path="login" element={<Login />} action={loginAction} />
      <Route path="trending" element={<Trending />} />
      <Route path="activate/:uid/:token" element={<Activate />} />
      <Route path="reset_password" element={<ResetPassword />} />
      <Route path="password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
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
    <div>
      <Outlet />
    </div>
  </>
}

