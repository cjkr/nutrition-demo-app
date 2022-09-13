import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-container">
      <form className="auth-form">
        <div className="auth-content">
          <h3 className="text-center display-6">Register</h3>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="username"
              name="username"
              id="username"
              placeholder="Username"
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button className="btn btn-primary" onClick={handleSignup}>
              Register
            </button>
          </div>
          <p className="forgot-password">
            Do you have an account? <Link to="/login">Log In!</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
