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
