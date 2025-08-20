import { Outlet } from "react-router-dom";
import LoadingCard from "../../../components/Cards/LoadingCard";
import { useAuth } from "../../../hooks/features/user/auth/use-auth";

export default function PublicResetComponent() {
  const { data: isAuthenticated, isloading } = useAuth();

  if (isloading) {
    return (
      <div className='loading-container'>
        <LoadingCard />
      </div>
    );
  }

  return (
    <div>
      <Outlet context={ isAuthenticated } />
    </div>
  );
}