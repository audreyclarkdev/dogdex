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

// Matches the app's palette (see index.css) and usual input radius
// (App.css). Hardcoded rather than read from the CSS variables, since
// Clerk's appearance prop needs plain strings, not custom properties.
const clerkAppearance = {
  variables: {
    colorPrimary: "#7a3b65", // --plum
    colorBackground: "#e3f0eefb",
    colorText: "#0f0f0f", // --text
    colorTextSecondary: "#5a4f64", // --grey-text
    colorInputBackground: "#ffffff",
    colorInputText: "#0f0f0f", // --text
    colorDanger: "#fdcab7", // --coral-dark
    colorSuccess: "#146664", // --teal-dark
    borderRadius: "12px",
    fontFamily: "'Nunito Sans', system-ui, 'Segoe UI', Roboto, sans-serif", // --sans
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
