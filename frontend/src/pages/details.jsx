import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";

function Details() {
  const [teacher, setTeacher] = useState({ name: "", subject: "" });
  const [teachli, setTeachli] = useState(() => {
    const saved = localStorage.getItem("teachli");
    return saved ? JSON.parse(saved) : [];
  });
  const [cla, setCla] = useState({ name: "", details: "" });
  const [clali, setClali] = useState(() => {
    const saved = localStorage.getItem("clali");
    return saved ? JSON.parse(saved) : [];
  });
  const [submitted, setSubmitted] = useState(() => {
    const saved = localStorage.getItem("submitted");
    return saved ? JSON.parse(saved) : false;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("teachli", JSON.stringify(teachli));
  }, [teachli]);

  useEffect(() => {
    localStorage.setItem("clali", JSON.stringify(clali));
  }, [clali]);

  useEffect(() => {
    localStorage.setItem("submitted", JSON.stringify(submitted));
  }, [submitted]);

  function handleAddTeacher(e) {
    e.preventDefault();
    if (!teacher.name.trim() || !teacher.subject.trim()) return;
    setTeachli((prev) => [...prev, teacher]);
    setTeacher({ name: "", subject: "" });
    setSubmitted(false); // require resubmit on change
  }

  function handleAddClass(e) {
    e.preventDefault();
    if (!cla.name.trim() || !cla.details.trim()) return;
    setClali((prev) => [...prev, cla]);
    setCla({ name: "", details: "" });
    setSubmitted(false);
  }

  function handleDeleteTeacher(index) {
    setTeachli(teachli.filter((_, i) => i !== index));
    setSubmitted(false);
  }

  function handleDeleteClass(index) {
    setClali(clali.filter((_, i) => i !== index));
    setSubmitted(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allData = { teachers: teachli, classes: clali };
    axios
      .post('http://localhost:5000/api/generate', { dic: allData })
      .then(response => {
        if (response.status === 200) {
          setSubmitted(true);
          alert("Successfully submitted!");
        } else {
          setSubmitted(false);
          alert("Submission failed!");
        }
      })
      .catch(error => {
        setSubmitted(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert("Error: " + error.response.data.error);
        } else {
          alert("Unknown Submission Error");
        }
      });
  }

  function handleReset() {
    if (!window.confirm("Clear all data?")) return;
    setTeachli([]);
    setClali([]);
    setTeacher({ name: "", subject: "" });
    setCla({ name: "", details: "" });
    setSubmitted(false);
    localStorage.removeItem("teachli");
    localStorage.removeItem("clali");
    localStorage.removeItem("submitted");
  }

  return (
    <div className="hero-bg">
      <div className="home-card">
        <form onSubmit={handleAddTeacher}>
          <h1>For Adding Teachers</h1>
          <label htmlFor="teacher-name">Teacher name</label>
          <input
            type="text"
            value={teacher.name}
            placeholder="Enter name"
            onChange={e =>
              setTeacher({ ...teacher, name: e.target.value })
            }
          />
          <label htmlFor="subjects">Enter subjects (separated by commas)</label>
          <input
            type="text"
            value={teacher.subject}
            placeholder="Enter subjects"
            onChange={e =>
              setTeacher({ ...teacher, subject: e.target.value })
            }
          />
          <button type="submit">Add</button>
        </form>
        {teachli.length > 0 && (
          <>
            <h3>Teachers List</h3>
            <ul>
              {teachli.map((t, i) => (
                <li key={i}>
                  <div className="ent">
                    <h4 className="enttitl">{t.name}</h4>
                    <p className="entsubj">{t.subject}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeacher(i)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="home-card">
        <form onSubmit={handleAddClass}>
          <h1>For Adding Classes</h1>
          <label htmlFor="class-name">Class name</label>
          <input
            type="text"
            placeholder="Enter class name"
            value={cla.name}
            onChange={e => setCla({ ...cla, name: e.target.value })}
          />
          <label htmlFor="sub-teach">
            Enter subject with teacher name eg. Subject(Teacher name)
          </label>
          <input
            type="text"
            placeholder="Enter your choices"
            value={cla.details}
            onChange={e => setCla({ ...cla, details: e.target.value })}
          />
          <button type="submit">Add</button>
        </form>
        {clali.length > 0 && (
          <>
            <h3>Classes List</h3>
            <ul>
              {clali.map((t, i) => (
                <li key={i}>
                  <div className="ent">
                    <h4 className="enttitl">{t.name}</h4>
                    <p className="entsubj">{t.details}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteClass(i)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <button onClick={handleReset}>Reset</button>
      <button id="submit" onClick={handleSubmit} disabled={teachli.length === 0 || clali.length === 0}>Submit</button>
      {submitted && (
          <Link to="/timetable" className="cta-btn">View TimeTable</Link>
      )}
    </div>
  );
}

export default Details;

