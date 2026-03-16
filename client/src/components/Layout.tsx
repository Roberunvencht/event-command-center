import { AppSidebar } from "./AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Topbar } from "./Topbar";
import { useUserStore } from "@/stores/user";
import { useEffect } from "react";

export function Layout() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === "user") {
      navigate("/client");
      return;
    }
  }, [user]);

  return (
    <div className='min-h-screen flex w-full'>
      <AppSidebar />
      <div className='flex-1 flex flex-col'>
        <Topbar />
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
