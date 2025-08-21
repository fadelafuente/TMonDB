import { Outlet } from "react-router-dom";

export function ResetComponent() {
  return (
    <div className='reset-container'>
      <Outlet />
    </div>
  );
}