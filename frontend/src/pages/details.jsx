import { React , useState } from "react";
import "./Home.css";

function Details() {
  const [teacher, setTeacher] = useState({
    name: "",
    subject: ""
  });
  const [cla, setCla] = useState("");
  return(
    <div className="hero-bg">
    <div className="home-card">
    <form>
    <label htmlfor="Class 1">Class 1</label>
    <input type="text" placeholder="Enter Class name " name="Class" />
    <label htmlfor="Class 2">Class 2</label>
    <input type="text" placeholder="Enter Class name " name="Class" />
    </form>
    <button>Submit</button>
    </div>
    </div>
  );
}

export default Details
