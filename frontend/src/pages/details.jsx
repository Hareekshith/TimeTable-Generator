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
				<form onSubmit={handleAddTeacher}>
					<h1>For Adding teachers!</h1>
					<label htmlFor="teacher name">Teacher name</label>
  				<input type="text" value={teacher.name} placeholder="Enter name" onChange={(e) => setTeacher({ ...teacher, name: e.target.value })} />
  				<label htmlFor="subjects">Enter subjects (separated by commas)</label>
  				<input type="text" value={teacher.subject} placeholder="Enter subjects" onChange={(e) => setTeacher({ ...teacher, subject: e.target.value })} />					
					<button type="Submit">Add</button>
				</form>
				<h3>Teachers List</h3>
				<ul>
  				{teachli.map((t, i) => (
    				<li key={i}>{t.name} - {t.subject}</li>
					))}
				</ul>

			</div>
			<div className="home-card">
				<form onSubmit={handleAddClass}>
					<h1>For adding classes</h1>
					<label htmlFor="Class name">Class name</label>
					<input type="text" placeholder="Enter class name " value={cla.name} onChange={(e) => setCla({...cla, name: e.target.value})} />
					<label htmlFor="sub-teach">Enter subject with teacher name eg. Subject(Teacher name)</label>
					<input type="text" placeholder="Enter your choices " value={cla.details} onChange={(e) => setCla({...cla, details: e.target.value})} />
					<button type="Submit">Add</button>
				</form>
				<h3>Class List</h3>
				<ul>
  				{clali.map((t, i) => (
    				<li key={i}>{t.name} - {t.subject}</li>
					))}
				</ul>
			</div>
			<button>Submit</button>
    </div>
  );
}
export default Details
