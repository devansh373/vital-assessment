import { useState } from "react";
import "./Auth.css";

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("vitalSenseUsers") || "[]");

    // Find user
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password,
    );

    if (user) {
      // Store current user session
      localStorage.setItem(
        "vitalSenseCurrentUser",
        JSON.stringify({
          email: user.email,
          name: user.name,
          loginTime: new Date().toISOString(),
        }),
      );
      onLogin(user);
    } else {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <div className="logo-section-auth">
            <div className="logo-icon"></div>
            <span className="logo-text">
              VitalSense<span className="highlight-text">Diagnostics</span>
            </span>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to continue your health assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message animate-fade-in">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onSwitchToSignup}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
