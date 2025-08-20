import { Outlet } from "react-router-dom";

export function Reset() {
  return (
    <div className='reset-container'>
      <Outlet />
    </div>
  );
}