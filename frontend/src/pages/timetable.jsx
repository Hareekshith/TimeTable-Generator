import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { IoArrowBack } from 'react-icons/io5';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const API_BASE = "https://stm-gq6j.onrender.com";
// const API_BASE = "http://localhost:5000";

function TimetableTable({ label, data, periodCount }) {
  return (
    <div className="time-card">
      <h3>{label}</h3>
      <table style={{tableLayout: "fixed"}}>
        <thead>
          <tr>
            <th style={{ width: "100px" }}>Day</th>
            {[...Array(periodCount)].map((_, i) => (
              <th key={i}>Period {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((day, dIndex) => (
            <tr key={dIndex}>
              <td style={{ fontWeight: 600, color: "var(--text-main)", background: "rgba(15, 23, 42, 0.4)" }}>
                {days[dIndex]}
              </td>
              {day.map((entry, pIndex) => (
                <td
                  key={pIndex}
                  style={{
                    background: entry ? "rgba(59, 130, 246, 0.1)" : "transparent",
                    color: entry ? "var(--accent2)" : "var(--text-muted)",
                    fontWeight: entry ? 500 : 400
                  }}
                >
                  {entry || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TimetablePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const timetableRef = useRef(null);

  const getAuthToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTimetable = async () => {
      const token = getAuthToken();
      if (!token) {
        alert("Not authenticated. Please login first.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/timetable`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch timetable:", err);
        alert("Unable to load timetable.");
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="hero-bg">
        <h2 style={{color: "var(--text-muted)"}}>Loading Timetable...</h2>
      </div>
    );
  }
  if (!data || !data.classes || !data.teachers) {
    console.log(data);
    return (
      <div className="hero-bg">
        <div className="home-card">
          <h1>No timetable available.</h1>
          <p className="subtitle">It looks like you haven't generated a timetable yet.</p>
          <Link to='/' className="cta-btn" style={{marginTop: "2rem"}}>Go Home</Link>
        </div>
      </div>
    );
  }

  const periodCount =
    data.classes[Object.keys(data.classes)[0]][0]?.length || 10;

  return (
    <div className="hero-bg timetable-wrapper" ref={timetableRef} style={{ display: 'block', padding: '4rem 2rem' }}>
      <Link to="/details" className="bck-btn" title="Back to Details">        
        <IoArrowBack size={24} />
      </Link>
      
      <div className="timetable-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ margin: 0, fontSize: "2.5rem" }}>Your Timetables</h1>
          <button onClick={() => window.print()} className="cta-btn" style={{ margin: 0 }}>Print PDF</button>
        </div>

        <h2 style={{ color: "var(--text-muted)", marginBottom: "1.5rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "0.5rem" }}>Class Schedules</h2>
        {Object.entries(data.classes).map(([className, table]) => (
          <TimetableTable
            key={className}
            label={className}
            data={table}
            periodCount={periodCount}
          />
        ))}

        <h2 style={{ color: "var(--text-muted)", marginTop: "4rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "0.5rem" }}>Teacher Schedules</h2>
        {Object.entries(data.teachers).map(([teacherName, table]) => (
          <TimetableTable
            key={teacherName}
            label={teacherName}
            data={table}
            periodCount={periodCount}
          />
        ))}
      </div>
    </div>
  );
}

