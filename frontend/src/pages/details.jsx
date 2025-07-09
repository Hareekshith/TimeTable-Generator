import { React , useState } from "react";
import "./Home.css";

function Details() {
  const [teacher, setTeacher] = useState({
    name: "",
    subject: ""
  });
  const [cla, setCla] = useState({
		name: "",
		details: ""
	});
	const [clali, setClali] = useState([]);
	const [teachli, setTeachli] = useState([]);
	function handleAddTeacher(e) {
  	e.preventDefault();
  	if (!teacher.name.trim() || !teacher.subject.trim()) return;
  	setTeachli([...teachli, teacher]);
  	setTeacher({ name: "", subject: "" });
	}
	function handleAddClass(e) {
  	e.preventDefault();
  	if (!cla.name.trim() || !cla.details.trim()) return;
  	setClali([...clali, cla]);
  	setCla({ name: "", details: "" });
	}
	function handleDeleteTeacher(index) {
  	setTeachli(teachli.filter((_, i) => i !== index));
	}
	function handleDeleteClass(index) {
		setClali(clali.filter((_, i) => i !== index));
	}
//	const allData={
//		teachers: teachli,
//		classes: clali
//	}
//	const jsonString = JSON.stringify(allData);
//	localStorage.setItem("timetableData", JSON.stringify(allData));
//	const saved = localStorage.getItem("timetableData");
//	if (saved) {
//  	const parsed = JSON.parse(saved);
//  	setTeachli(parsed.teachers || []);
//  	setClali(parsed.classes || []);
//	}
	function handleSubmit(e) {
  e.preventDefault(); // Prevents page reload

  // Combine all your data
  const allData = {
    teachers: teachli,
    classes: clali
  };

  // Example: Send to backend
  fetch('/api/submit-timetable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(allData)
  })
    .then(response => response.json())
    .then(data => {
      // Handle response from backend (show success, etc.)
      alert('Timetable submitted successfully!');
      // Optionally: clear lists or redirect
    })
    .catch(error => {
      // Handle errors
      alert('Error submitting timetable!');
      console.error(error);
    });

  // Optionally: Save to localStorage for persistence
  // localStorage.setItem("timetableData", JSON.stringify(allData));
}

  return(
    <div className="hero-bg">
			<div className="home-card">
				<form onSubmit={handleAddTeacher}>
					<h1>For Adding Teachers</h1>
					<label htmlFor="teacher name">Teacher name</label>
  				<input type="text" value={teacher.name} placeholder="Enter name" onChange={(e) => setTeacher({ ...teacher, name: e.target.value })} />
  				<label htmlFor="subjects">Enter subjects (separated by commas)</label>
  				<input type="text" value={teacher.subject} placeholder="Enter subjects" onChange={(e) => setTeacher({ ...teacher, subject: e.target.value })} />					
					<button type="Submit">Add</button>
				</form>
				<h3>Teachers List</h3>
				<ul>
  				{teachli.map((t, i) => (
    				<li key={i}> <div className="ent"> <h4 className="enttitl">{t.name}</h4> 
							<p className="entsubj">{t.subject}</p> 
						<button onClick={() => handleDeleteTeacher(i)}>Delete</button></div> </li>
					))}
				</ul>
			</div>
			<div className="home-card">
				<form onSubmit={handleAddClass}>
					<h1>For Adding Classes</h1>
					<label htmlFor="Class name">Class name</label>
					<input type="text" placeholder="Enter class name " value={cla.name} onChange={(e) => setCla({...cla, name: e.target.value})} />
					<label htmlFor="sub-teach">Enter subject with teacher name eg. Subject(Teacher name)</label>
					<input type="text" placeholder="Enter your choices " value={cla.details} onChange={(e) => setCla({...cla, details: e.target.value})} />
					<button type="Submit">Add</button>
				</form>
				<h3>Class List</h3>
				<ul>
  				{clali.map((t, i) => (
    				<li key={i}> <div className="ent"> <h4 className="enttitl">{t.name}</h4> 
							<p className="entsubj">{t.details}</p> 
						<button onClick={() => handleDeleteClass(i)}>Delete</button></div> </li>
					))}
				</ul>
			</div>
			<button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
export default Details
