import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import { EventRecProvider } from "./contexts/EventRecContext.tsx";
import { SelectedEventsProvider } from "./contexts/SelectedEventsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <EventRecProvider>
        <SelectedEventsProvider>
          <App />
        </SelectedEventsProvider>
      </EventRecProvider>
    </UserProvider>
  </StrictMode>,
);
