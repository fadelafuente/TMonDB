import { Navigate, Outlet } from 'react-router-dom';
import LoadingCard from '../../../components/Cards/LoadingCard';
import { useAuth } from '../../../hooks/features/user/auth/use-auth';

export default function PrivateResetComponent() {
  const { data: isAuthenticated, isloading } = useAuth();

  if(isloading) {
    return (
      <div className='loading-container'>
        <LoadingCard />
      </div>
    );
  }

  if(!isAuthenticated && isAuthenticated !== undefined) {
    return <Navigate to='/login' />;
  }

  if(isAuthenticated) {
    return (
      <div>
        <Outlet context={ isAuthenticated } />
      </div>
    );
  }
}