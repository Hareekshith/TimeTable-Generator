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
					<h1>For Adding teachers!</h1>
					<label htmlFor="teacher name">Teacher name</label>
    			<input type="text" placeholder="Enter name " name="Teacher" />
					<label htmlFor="subjects">Enter subjects (seperated by commas)</label>
					<input type="text" placeholder="Enter subjects " name="Subj" />
					<h1>For adding classes</h1>
					<label htmlFor="Class name">Class name</label>
					<input type="text" placeholder="Enter class name " name="Class" />
					<label htmlFor="sub-teach">Enter subject with teacher name eg. Subject(Teacher name)</label>
					<input type="text" placeholder="Enter your choices " name="classsubj" />
				</form>
				<button>Submit</button>
			</div>
    </div>
  );
}
export default Details
