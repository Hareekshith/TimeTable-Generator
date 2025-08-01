import React, { useState } from "react";
import { Navigate } from "react-router-dom";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "./firebase";

export default function Login(){
  const [un, setUn] = useState("Enter a username ");
  const [psswd, setPsswd] = useState("Enter a password ");
  return (
    <div className="hero-bg">
      <div className="home-card">
        <label htmlFor="Username">Enter the username </label>
        <input type="text" name="Enter username " value={un} />
        <label htmlFor="Password">Enter the password</label>
        <input type="text" name="Enter password " value={psswd} />
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}
