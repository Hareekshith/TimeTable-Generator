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
      setLoggedIn(true);
      navigate("/details");
    } catch(err){
      setError("Login Failed: "+err.message);
      alert(err.message);
    }
  }

  if (loggedIn) {
    return <Navigate to="/details" />;
  }

  return (
    <div className="hero-bg">
      <div className="home-card" style={{gridColumn: "1/-1", height: "30rem", width: "35rem", display: "flex", gap: "40px", flexDirection: "column"}}>
        {isNew ? <h1>Introduce yourself!</h1> : <h1>Let's see who you really are!</h1>}
        <form onSubmit={handleSubmit} style={{gap: "50px", justifyContent: "center", alignContent: 'center'}}>
          <input type="email" name="username" value={un} placeholder="Enter email" onChange={e => setUn(e.target.value)} required />
          <input type="password" name="password" value={psswd} placeholder="Enter the password" onChange={e => setPsswd(e.target.value)} required />
          <p>Are you new? <button type="button" onClick={() => setIsNew(true)} style={{width: "10rem"}}>Click Here</button></p>
          <button type="submit">{isNew ? "Register" : "Login"}</button>
        </form>
        {error && <p style={{color:"red"}}>{error}</p>}
      </div>
    </div>
  );
}

