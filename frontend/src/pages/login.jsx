import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [isNew, setIsNew] = useState(false);
  const [un, setUn] = useState("");
  const [psswd, setPsswd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_base = "https://stm-gq6j.onrender.com";
  // const API_base = "http://localhost:5000";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (isNew) {
        // Register new user
        await axios.post(`${API_base}/register`, { username: un, password: psswd });
        alert("Registration successful! Please log in.");
        setIsNew(false);
      } else {
        // Login existing user
        const response = await axios.post(`${API_base}/login`, { username: un, password: psswd });
        if (response.data.access_token) {
          localStorage.setItem("authToken", response.data.access_token);
          navigate('/details');
        } else {
          setError("Login failed: No token received");
        }
      }
    } catch (err) {
      setError("Error: " + (err.response?.data?.msg || err.message));
    }
  }

  return (
    <div className="hero-bg">
      <div className="login">
        {isNew ? <h1>Create Account</h1> : <h1>Welcome Back</h1>}
        <p className="subtitle">
          {isNew ? "Enter your details to register" : "Please login to continue"}
        </p>
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="username"
            value={un}
            placeholder="Enter email"
            onChange={e => setUn(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={psswd}
            placeholder="Enter password"
            onChange={e => setPsswd(e.target.value)}
            required
          />
          
          <button type="submit" style={{ marginTop: "1rem" }}>
            {isNew ? "Register" : "Login"}
          </button>
        </form>

        {isNew ? (
          <div className="toggle-auth">
            <span>Already have an account?</span>
            <button type="button" onClick={() => setIsNew(false)}>Login</button>
          </div>
        ) : (
          <div className="toggle-auth">
            <span>New here?</span>
            <button type="button" onClick={() => setIsNew(true)}>Register</button>
          </div>
        )}

        {error && <p style={{ color: "var(--danger)", marginTop: "1rem", fontWeight: "500" }}>{error}</p>}
      </div>
    </div>
  );
}

