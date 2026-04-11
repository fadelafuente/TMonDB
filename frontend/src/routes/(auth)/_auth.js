import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/features/user/auth/use-auth';
import LoadingCard from '../../components/Cards/LoadingCard';

export default function AuthComponent() {
  const { data: isAuthenticated, isLoading } = useAuth();
  
  if(isLoading) {
    return (
      <div className='loading-container'>
        <LoadingCard />
      </div>
    );
  }

  if(isAuthenticated) {
    return <Navigate to='/' replace={ true } />;
  }

  return (
    <div>
      <Outlet context={ isAuthenticated } />
    </div>
  )
}