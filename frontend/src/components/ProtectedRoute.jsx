import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/react";

// Wraps a group of routes (see App.jsx) so they redirect to /sign-in
// instead of rendering when nobody's signed in. isLoaded must be checked
// first - isSignedIn is undefined (not false) until Clerk finishes
// loading, so checking it too early would flash a redirect for everyone.
function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
