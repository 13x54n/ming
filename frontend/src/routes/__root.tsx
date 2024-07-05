import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useSDK } from "@metamask/sdk-react";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
  component: () => {
    const { connected } = useSDK();

    return (
      <>
        <Navbar />
        {connected ? (
          <>
            <div className="p-2 flex gap-2">
              <Link to="/" className="[&.active]:font-bold">
                Home
              </Link>
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
            </div>
            <hr />
            <Outlet />
          </>
        ) : (
          <></>
        )}
        <TanStackRouterDevtools />
      </>
    );
  },
});
