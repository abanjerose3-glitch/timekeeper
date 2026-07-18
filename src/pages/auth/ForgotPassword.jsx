import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";

import rosetteLogo from "../../assets/rosette-logo.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
  
    setLoading(true);
    setError("");
    setMessage("");
  
    try {
      await resetPassword(email);
  
      setMessage(
        "If an account exists for that email, a password reset link has been sent."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

        <div className="mb-8 flex flex-col items-center">
          <img
            src={rosetteLogo}
            alt="Rosette"
            className="mb-5 h-24 w-auto"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              required
            />
          </div>

          {message && (
  <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
    {message}
  </div>
)}

{error && (
  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
    {error}
  </div>
)}

<button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
>
  {loading ? "Sending..." : "Send Reset Link"}
</button>

        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Login
          </Link>
        </div>

        <div className="mt-10 border-t pt-5 text-center">
          <p className="text-xs text-slate-400">
            © 2026 JNA. All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;