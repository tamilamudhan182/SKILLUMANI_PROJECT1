import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

function LoginPage() {
  const { login, register, token } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (isRegistering) {
        await register(formData);
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div>
          <p className="eyebrow">Task Tracker</p>
          <h1>Keep your work clear, sorted, and moving.</h1>
          <p className="auth-copy">
            Sign in to manage your tasks, mark progress quickly, and filter what matters most.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{isRegistering ? "Create account" : "Welcome back"}</h2>

          {isRegistering ? (
            <label>
              Name
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required={isRegistering}
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="error-message">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={busy}>
            {busy ? "Please wait..." : isRegistering ? "Register" : "Login"}
          </button>

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setIsRegistering((current) => !current);
              setError("");
            }}
          >
            {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
