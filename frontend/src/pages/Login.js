import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";
import { Link, Navigate } from "react-router-dom";
import Authservice from "../services/auth.service";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  if (isLoggedIn) {
    return <Navigate to="/main" />;
  }

  return (
    <div className="auth-container g-0">
      <form className="auth-form">
        <div className="auth-content">
          <h3 className="text-center display-6">Log-in</h3>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="form-control"
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
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <p className="forgot-password">
            Don't have an account yet? <Link to="/signup">Sign Up!</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
