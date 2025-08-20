import { Outlet, useOutletContext } from 'react-router-dom';

export default function PublicAppComponent() {
  const { isAuthenticated, query } = useOutletContext();

  return (
    <div>
      <Outlet context={{ isAuthenticated, query }} />
    </div>
  )
}