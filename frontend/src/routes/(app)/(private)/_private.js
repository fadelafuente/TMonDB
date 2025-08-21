import { Navigate, Outlet, useOutletContext } from 'react-router-dom';

export default function PrivateAppComponent() {
  const { user, query, isAuthenticated } = useOutletContext();

  if(!isAuthenticated && isAuthenticated !== undefined) {
    return <Navigate to='/login' replace={ true } />
  }

  return (
    <div>
      <Outlet context={{ user, query, isAuthenticated }} />
    </div>
  )
}