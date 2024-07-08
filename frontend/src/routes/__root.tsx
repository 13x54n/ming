import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "../components/Navbar";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useState } from "react";

export const Route = createRootRoute({
  component: () => {
    const [activeTab, setActiveTab] = useState('overview')
    const isLoggedIn = useIsLoggedIn();

    return (
      <>
        <Navbar />
        {isLoggedIn ? (
          <>
            <div className="container py-1 mx-3 flex items-center gap-2 text-sm font-medium">
              <Link className={`px-3 ${activeTab === 'overview' && 'border-b-green-2'}`} to="/">Overview</Link>
              <Link className={`px-3 ${activeTab === 'overview' && 'border-b-green-2'}`} to="/">Peers</Link>
              <Link className={`px-3 ${activeTab === 'overview' && 'border-b-green-2'}`} to="/">Monitoring</Link>
              <Link className={`px-3 ${activeTab === 'overview' && 'border-b-green-2'}`} to="/">Settings</Link>
            </div>
            <div className="border-t-2">
            <Outlet />
            </div>
          </>
        ) : (
          <>This is unAuthenticated home page</>
        )}
        <TanStackRouterDevtools />
      </>
    );
  },
});
