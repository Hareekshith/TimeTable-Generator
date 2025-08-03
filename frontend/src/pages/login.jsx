import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login(){
  const [isNew, setIsNew] = useState(false);
  const [un, setUn] = useState("");
  const [psswd, setPsswd] = useState("");
  const [loggedIn, setLoggedIn] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false)

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
  return (
    <div className="hero-bg">     
      <div className="home-card" style={{gridColumn: "1/-1", height: "30rem", width: "35rem", display: "flex", gap: "40px", flexDirection: "column"}}>
    {isNew === true && <h1>Introduce yourself!</h1>}
    {isNew === false && <h1>Let's see who you really are!</h1>}
      <form onSubmit={handleSubmit} style={{gap: "50px", justifyContent: "center"}}>
        <input type="email" name="username" value={un} placeholder="Enter email" onChange={e => setUn(e.target.value)} />
        <input type="password" name="password" value={psswd} placeholder="Enter the password" onChange={e => setPsswd(e.target.value)}/>
        <p>Are you new? <a onClick={e => setIsNew(true)}>Click Here</a> </p>
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  );
}
