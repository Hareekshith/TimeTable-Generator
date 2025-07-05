import { React , useState } from "react";
import "./Home.css";

function Details() {
  const [teacher, setTeacher] = useState({
    name: "",
    subject: ""
  });
  const [cla, setCla] = useState({
		name: "",
		details: "",
	});
	const [clali, setClali] = useState([]);
	const [teachli, setTeachli] = useState([]);
	function handleAddTeacher(e) {
  	e.preventDefault();
  	// Basic validation (optional)
  	if (!teacher.name.trim() || !teacher.subject.trim()) return;
  	// Add current teacher to the list
  	setTeachli([...teachli, teacher]);
  	// Reset input fields
  	setTeacher({ name: "", subject: "" });
	}
	function handleAddClass(e) {
  	e.preventDefault();
  	// Basic validation (optional)
  	if (!cla.name.trim() || !cla.details.trim()) return;
  	// Add current class to the list
  	setClali([...clali, cla]);
  	// Reset input fields
  	setCla({ name: "", details: "" });
	}

  return(
    <div className="hero-bg">
			<div className="home-card">
				<form>
					<h1>For Adding teachers!</h1>
					<label htmlFor="teacher name">Teacher name</label>
    			<input type="text" placeholder="Enter name " name="Teacher" />
					<label htmlFor="subjects">Enter subjects (seperated by commas)</label>
					<input type="text" placeholder="Enter subjects " name="Subj" />
					<button>Add</button>
				</form>
			</div>
			<div className="home-card">
				<form>
					<h1>For adding classes</h1>
					<label htmlFor="Class name">Class name</label>
					<input type="text" placeholder="Enter class name " name="Class" />
					<label htmlFor="sub-teach">Enter subject with teacher name eg. Subject(Teacher name)</label>
					<input type="text" placeholder="Enter your choices " name="classsubj" />
					<button>Add</button>
				</form>
			</div>
			<button>Submit</button>
    </div>
  );
}
export default Details
