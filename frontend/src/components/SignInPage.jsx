import { SignIn } from "@clerk/react";

// Sign-in page - wraps Clerk's prebuilt <SignIn> component in the app's
// usual page/section-card shell so it looks consistent with everything
// else instead of floating unstyled on the page.
function SignInPage() {
  return (
    <div className="page">
      <h1>Sign In</h1>
      <section className="section-card section-card--brand-blue clerk-auth-card">
        {/* The /* wildcard on this route (see App.jsx) is required for
            Clerk's multi-step flows (email verification, etc.) to work
            with React Router. */}
        <SignIn signUpUrl="/sign-up" />
      </section>
    </div>
  );
}

export default SignInPage;
