import { useState } from "react";
import "./Auth.css";
import ThemeToggle from "./ThemeToggle";

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const validateForm = () => {
    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("vitalSenseUsers") || "[]");

    // Check if user already exists
    const existingUser = users.find((u) => u.email === formData.email);
    if (existingUser) {
      setError("An account with this email already exists");
      setLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    users.push(newUser);
    localStorage.setItem("vitalSenseUsers", JSON.stringify(users));

    // Store current user session
    localStorage.setItem(
      "vitalSenseCurrentUser",
      JSON.stringify({
        email: newUser.email,
        name: newUser.name,
        loginTime: new Date().toISOString(),
      }),
    );

    onSignup(newUser);
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <div className="auth-header-top">
            <div className="logo-section-auth">
              <div className="logo-icon"></div>
              <span className="logo-text">
                VitalSense<span className="highlight-text">Diagnostics</span>
              </span>
            </div>
            <ThemeToggle />
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Join us for comprehensive health assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message animate-fade-in">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="Create a password (min. 6 characters)"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="link-button"
                onClick={onSwitchToLogin}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
