import { SignUp } from "@clerk/react";

// Sign-up page - mirrors SignInPage; see that file for why it's wrapped
// in .page/.section-card instead of rendering Clerk's component bare.
function SignUpPage() {
  return (
    <div className="page">
      <h1>Sign Up</h1>
      <section className="section-card section-card--brand-blue clerk-auth-card">
        <SignUp signInUrl="/sign-in" />
      </section>
    </div>
  );
}

export default SignUpPage;
