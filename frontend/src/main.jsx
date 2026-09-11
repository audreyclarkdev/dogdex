import { ClerkProvider } from "@clerk/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// Vite only exposes env vars prefixed with VITE_ to client code (see
// frontend/.env.local, written by `clerk env pull`).
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY - run `clerk env pull` in frontend/ to generate .env.local",
  );
}

// Matches --plum and the app's usual input radius (see index.css/App.css).
// Hardcoded rather than read from the CSS variable, since Clerk's
// appearance prop needs a plain string, not a CSS custom property.
const clerkAppearance = {
  variables: {
    colorPrimary: "#7a3b65",
    borderRadius: "12px",
  },
};

createRoot(document.getElementById("root")).render(
  <>
    {/* ClerkProvider wraps BrowserRouter (not the other way around) so
        Clerk's own components (SignIn/SignUp's internal multi-step
        flows) have router context available the way Clerk expects. */}
    <ClerkProvider
      publishableKey={publishableKey}
      afterSignOutUrl="/"
      appearance={clerkAppearance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </>,
);
