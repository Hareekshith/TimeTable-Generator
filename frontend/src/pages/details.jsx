import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { IoArrowBack, IoTrashOutline } from 'react-icons/io5';

const API_BASE = "https://stm-gq6j.onrender.com"; // Your backend base URL
// const API_BASE = "http://localhost:5000";
function Details() {
  const [noper, setNoper] = useState(0);
  const [teacher, setTeacher] = useState({ name: "", subject: "" });
  const [teachli, setTeachli] = useState([]);
  const [cla, setCla] = useState({ name: "", details: "" });
  const [clali, setClali] = useState([]);

  const navigate = useNavigate();
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
          { noper, teachli, clali},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Failed to save user data", error);
      }
    };
    saveUserData();
  }, [noper, teachli, clali]);

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
    
  }

  function handleAddClass(e) {
    e.preventDefault();
    if (!cla.name.trim() || !cla.details.trim()) return;
    setClali((prev) => [...prev, cla]);
    setCla({ name: "", details: "" });
    
  }

  function handleDeleteTeacher(index) {
    setTeachli(teachli.filter((_, i) => i !== index));
    
  }

  function handleDeleteClass(index) {
    setClali(clali.filter((_, i) => i !== index));
    
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
        alert("Successfully submitted!");
          navigate('/timetable');
      } else {
        alert("Submission failed!");
      }
    } catch (error) {
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
    <div className="hero-bg" style={{ display: 'block', padding: '4rem 2rem' }}>
      <Link to="/login" className="bck-btn" title="Back">
        <IoArrowBack size={24} />
      </Link>
      
      <div className="details-container" style={{ margin: '0 auto' }}>
        <h1>Timetable Details</h1>
        <p className="subtitle">Configure your slots, teachers, and classes below.</p>

        {/* Slots Section on top */}
        <div className="details-section" style={{ marginBottom: "2rem" }}>
          <h2>1. Daily Slots</h2>
          <form onSubmit={handleAddSlot} style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="no-periods">Number of slots per day</label>
              <input 
                type="number" 
                value={noper || ""} 
                placeholder="e.g. 8" 
                onChange={(e) => setNoper(parseInt(e.target.value) || 0)} 
                min="1"
              />
            </div>
            <button type="submit" style={{height: "46px", padding: "0 2rem"}}>Set Slots</button>
          </form>
        </div>

        <div className="details-grid">

          {/* Teachers Section */}
          <div className="details-section">
            <h2>2. Add Teachers</h2>
            <form onSubmit={handleAddTeacher}>
              <label>Teacher Name</label>
              <input type="text" value={teacher.name} placeholder="e.g. John Doe" onChange={(e) => setTeacher({ ...teacher, name: e.target.value })} />
              <label>Subjects (comma separated)</label>
              <input type="text" value={teacher.subject} placeholder="e.g. Math, Physics" onChange={(e) => setTeacher({ ...teacher, subject: e.target.value })} />
              <button type="submit" style={{width: "100%", marginTop: "0.5rem"}}>Add Teacher</button>
            </form>
            
            {teachli.length > 0 && (
              <ul style={{marginTop: "1.5rem"}}>
                {teachli.map((t, i) => (
                  <li key={i} className="ent">
                    <div className="ent-content">
                      <p className="enttitl">{t.name}</p>
                      <p className="entsubj">{t.subject}</p>
                    </div>
                    <button type="button" className="danger-btn" onClick={() => handleDeleteTeacher(i)} title="Delete">
                      <IoTrashOutline size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Classes Section */}
          <div className="details-section">
            <h2>3. Add Classes</h2>
            <form onSubmit={handleAddClass}>
              <label>Class Name</label>
              <input type="text" placeholder="e.g. Grade 10 A" value={cla.name} onChange={(e) => setCla({ ...cla, name: e.target.value })} />
              <label>Requirements</label>
              <input type="text" placeholder="e.g. Math(John Doe)" value={cla.details} onChange={(e) => setCla({ ...cla, details: e.target.value })} />
              <button type="submit" style={{width: "100%", marginTop: "0.5rem"}}>Add Class</button>
            </form>

            {clali.length > 0 && (
              <ul style={{marginTop: "1.5rem"}}>
                {clali.map((t, i) => (
                  <li key={i} className="ent">
                    <div className="ent-content">
                      <p className="enttitl">{t.name}</p>
                      <p className="entsubj">{t.details}</p>
                    </div>
                    <button type="button" className="danger-btn" onClick={() => handleDeleteClass(i)} title="Delete">
                      <IoTrashOutline size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="details-actions">
          <button type="button" className="danger-btn" onClick={handleReset} style={{height: "3rem", padding: "0 2rem"}}>Reset All</button>
          <button type="button" className="cta-btn" onClick={handleSubmit} disabled={teachli.length === 0 || clali.length === 0 || !noper} style={{margin: 0}}>
            Generate Timetable
          </button>
        </div>
      </div>
    </div>
  );
}

export default Details;

