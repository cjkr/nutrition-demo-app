import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { register } from "../actions/auth";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSignup = (e) => {
    e.preventDefault();

    dispatch(register(username, email, password));
  };

  if (isLoggedIn) {
    return <Navigate to="/main" />;
  }

  return (
    <div className="auth-container">
      <form className="auth-form">
        <div className="auth-content">
          <h3 className="text-center display-6">Register</h3>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              value={username}
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
              value={email}
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
              value={password}
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
