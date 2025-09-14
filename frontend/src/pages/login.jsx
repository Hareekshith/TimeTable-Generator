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
          sessionStorage.setItem("authToken", response.data.access_token);
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
        {isNew ? <h1>Introduce yourself!</h1> : <h1>Let's see who you really are!</h1>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="username"
            value={un}
            placeholder="Enter email"
            onChange={e => setUn(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            value={psswd}
            placeholder="Enter the password"
            onChange={e => setPsswd(e.target.value)}
            required
          />
          {isNew ? (
            <>
              <p>Have you already been here?</p>
              <button type="button" onClick={() => setIsNew(false)} style={{ width: "10rem" }}>
                Click Here
              </button>
            </>
          ) : (
            <>
              <p>Are you new?</p>
              <button type="button" onClick={() => setIsNew(true)} style={{ width: "10rem" }}>
                Click Here
              </button>
            </>
          )}
          <button type="submit">{isNew ? "Register" : "Login"}</button>
        </form>
        {error && <p style={{ color: "red", gridColumn: "1/-1" }}>{error}</p>}
      </div>
    </div>
  );
}

