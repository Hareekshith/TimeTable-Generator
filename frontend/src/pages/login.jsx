import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login(){
  const [isNew, setIsNew] = useState(false);
  const [un, setUn] = useState("");
  const [psswd, setPsswd] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try{
      if (isNew) {
        await createUserWithEmailAndPassword(auth, un, psswd);
      } else {
        await signInWithEmailAndPassword(auth, un, psswd);
      }
      navigate('/details');
    } catch(err){
      setError("Login Failed: "+err.message);
      alert(err.message);
    }
  }
  return (
    <div className="hero-bg">
      <div className="login">
        {isNew ? <h1>Introduce yourself!</h1> : <h1>Let's see who you really are!</h1>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="username" value={un} placeholder="Enter email" onChange={e => setUn(e.target.value)} required />
          <input type="password" name="password" value={psswd} placeholder="Enter the password" onChange={e => setPsswd(e.target.value)} required />
          {isNew ? (
            <>
              <p>Have you already been here?</p>
              <button type="button" onClick={() => setIsNew(false)} style={{ width: "10rem" }}>Click Here</button>
            </>
            ) : (
            <>
              <p>Are you new?</p>
              <button type="button" onClick={() => setIsNew(true)} style={{ width: "10rem" }}>
              Click Here</button>
            </>
          )}
          <button type="submit">{isNew ? "Register" : "Login"}</button>
        </form>
        {error && <p style={{color:"red", gridColumn: "1/-1"}}>{error}</p>}
      </div>
    </div>
  );
}

