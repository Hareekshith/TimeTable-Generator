
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const API_BASE = "http://localhost:5000"; // Your backend base URL

function Details() {
  const [noper, setNoper] = useState(0);
  const [teacher, setTeacher] = useState({ name: "", subject: "" });
  const [teachli, setTeachli] = useState([]);
  const [cla, setCla] = useState({ name: "", details: "" });
  const [clali, setClali] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Helper to get stored JWT auth token
  const getAuthToken = () => localStorage.getItem("authToken");

  // Fetch user data on mount, method GET
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE}/api/userdata`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          if (response.data.noper !== undefined) setNoper(response.data.noper);
          if (response.data.teachli) setTeachli(response.data.teachli);
          if (response.data.clali) setClali(response.data.clali);
          if (response.data.submitted !== undefined) setSubmitted(response.data.submitted);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, []);

  // Save user data on noper, teachli, clali, submitted change with POST
  useEffect(() => {
    const saveUserData = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        await axios.post(
          `${API_BASE}/api/userdata/save`,
          { noper, teachli, clali, submitted },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to save user data", error);
      }
    };
    saveUserData();
  }, [noper, teachli, clali, submitted]);

  function handleAddSlot(e) {
    e.preventDefault();
    if (!noper || isNaN(noper) || noper <= 0) {
      alert("Please enter a valid number of periods per day.");
      return;
    }
    alert(`Slots per day set to ${noper}`);
  }

  function handleAddTeacher(e) {
    e.preventDefault();
    if (!teacher.name.trim() || !teacher.subject.trim()) return;
    setTeachli((prev) => [...prev, teacher]);
    setTeacher({ name: "", subject: "" });
    setSubmitted(false);
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

  async function handleSubmit(e) {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      alert("Not authenticated. Please log in.");
      return;
    }
    const allData = { teachers: teachli, classes: clali, noslot: noper, timetable: {} };
    try {
      const response = await axios.post(
        `${API_BASE}/api/generate`,
        { dic: allData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setSubmitted(true);
        alert("Successfully submitted!");
      } else {
        setSubmitted(false);
        alert("Submission failed!");
      }
    } catch (error) {
      setSubmitted(false);
      if (error.response?.data?.error) {
        alert("Error: " + error.response.data.error);
      } else {
        alert("Unknown Submission Error");
      }
    }
  }

  async function handleReset() {
    if (!window.confirm("Clear all data?")) return;
    setTeachli([]);
    setClali([]);
    setTeacher({ name: "", subject: "" });
    setCla({ name: "", details: "" });
    setSubmitted(false);
    setNoper(0);
    const token = getAuthToken();
    if (!token) return;
    try {
      await axios.post(
        `${API_BASE}/api/userdata/reset`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to reset user data", error);
    }
  }

  return (
    <div className="hero-bg">
      <Link to="/" className="cta-btn" id="dd" style={{ gridColumn: "1/2", marginTop: "1rem", justifySelf: "left", marginLeft: "1rem", height: "maxContent" }}>
        &lt;-
      </Link>
      <div className="home-card" style={{ gridColumn: "1/span 2" }}>
        <form onSubmit={handleAddSlot}>
          <label htmlFor="no-periods">Number of slots per day</label>
          <input type="text" value={noper} placeholder="No. of slots " onChange={(e) => setNoper(parseInt(e.target.value) || 0)} />
          <button type="submit">Set</button>
        </form>
      </div>
      <div className="home-card">
        <form onSubmit={handleAddTeacher}>
          <h1>For Adding Teachers</h1>
          <label htmlFor="teacher-name">Teacher name</label>
          <input type="text" value={teacher.name} placeholder="Enter name" onChange={(e) => setTeacher({ ...teacher, name: e.target.value })} />
          <label htmlFor="subjects">Enter subjects (separated by commas)</label>
          <input type="text" value={teacher.subject} placeholder="Enter subjects" onChange={(e) => setTeacher({ ...teacher, subject: e.target.value })} />
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
                    <button type="button" onClick={() => handleDeleteTeacher(i)}>
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
          <input type="text" placeholder="Enter class name" value={cla.name} onChange={(e) => setCla({ ...cla, name: e.target.value })} />
          <label htmlFor="sub-teach">Enter subject with teacher name eg. Subject(Teacher name)</label>
          <input type="text" placeholder="Enter your choices" value={cla.details} onChange={(e) => setCla({ ...cla, details: e.target.value })} />
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
                    <button type="button" onClick={() => handleDeleteClass(i)}>
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
      <button id="submit" onClick={handleSubmit} disabled={teachli.length === 0 || clali.length === 0}>
        Submit
      </button>
      <Link to="/timetable" className="cta-btn">
        View TimeTable
      </Link>
    </div>
  );
}

export default Details;

