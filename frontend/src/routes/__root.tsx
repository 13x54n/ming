import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "../components/Navbar";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";

export const Route = createRootRoute({
  component: () => {
    const isLoggedIn = useIsLoggedIn();

    return (
      <>
        <Navbar />
        {isLoggedIn ? (
          <>
            <Outlet />
          </>
        ) : (
          <>This is unAuthenticated home page</>
        )}
        <TanStackRouterDevtools />
      </>
    );
  },
});
