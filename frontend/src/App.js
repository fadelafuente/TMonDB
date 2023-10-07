import './assets/styling/App.css';
import Login, {action as loginAction} from './pages/Login'
import { Outlet, RouterProvider } from 'react-router-dom';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Trending from './pages/Trending';

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="login" element={<Login />} action={loginAction} />
      <Route path="trending" element={<Trending />} />
    </Route>
  ))

  return (
    <RouterProvider router={router} />
  );
}

const Root = () => {
  return <> 
    <div>
      <Outlet />
    </div>
  </>
}

