import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import "remixicon/fonts/remixicon.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <DynamicContextProvider
      theme="dark"
        settings={{
          environmentId: "5dfdf4a3-7176-488d-a89a-8266cdef72a2",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <RouterProvider router={router} />
      </DynamicContextProvider>
      <Analytics />
    </StrictMode>
  );
}
