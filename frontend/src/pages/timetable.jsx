
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
            <th>Day</th>
            {[...Array(periodCount)].map((_, i) => (
              <th key={i}>P{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((day, dIndex) => (
            <tr key={dIndex}>
              <td>{days[dIndex]}</td>
              {day.map((entry, pIndex) => (
                <td
                  key={pIndex}
                  style={{
                    background: entry ? "#232b41" : "#3c4047",
                    color: entry ? "#ff9800" : "#aaa",
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
      <div className="hero-bg" style={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }}>Loading...</div>
    );
  }
  if (!data || !data.classes || !data.teachers) {
    console.log(data);
    return (
      <div className="hero-bg" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="home-card"><h1>No timetable available.</h1>
        <h2>Incase of building a new timetable, please land on the home screen!</h2>
        <Link to='/' className="cta-btn" style={{marginTop: "4rem"}}>Home</Link></div>
      </div>
    );
  }

  const periodCount =
    data.classes[Object.keys(data.classes)[0]][0]?.length || 10;

  return (
    <div className="hero-bg" ref={timetableRef}>
      <Link to="/details" className="bck-btn" id="dd">        
        <IoArrowBack style={{ marginRight: '8px' }}/>
      </Link>
      <h2 style={{ textAlign: "center", gridColumn: "1/span 2" }}>Class Timetables</h2>
      {Object.entries(data.classes).map(([className, table], index, array) => {
        const isOdd = array.length % 2 !== 0;
        const isLast = index === array.length - 1;
        const shouldCenter = isOdd && isLast;
        return (
          <div
            key={className}
            style={{
              gridColumn: shouldCenter ? "1/ -1 " : "auto",
            }}>
            <TimetableTable
              label={className}
              data={table}
              periodCount={periodCount}
            />
          </div>
        );
      })}
      <h2 style={{ textAlign: "center", marginTop: "2rem", gridColumn: "1 / span 2" }}>Teacher Timetables</h2>
      {Object.entries(data.teachers).map(([teacherName, table], index, array) => {
        const isOdd = array.length % 2 !== 0;
        const isLast = index === array.length - 1;
        const shouldCenter = isOdd && isLast;
        return (
          <div
            key={teacherName}
            style={{
              gridColumn: shouldCenter ? "1/ -1" : "auto",
            }}
          >
            <TimetableTable
              label={teacherName}
              data={table}
              periodCount={periodCount}
            />
          </div>
        );
      })}
      <button onClick={() => window.print()} style={{ marginBottom: "1rem" }}>Print PDF</button>
    </div>
  );
}

