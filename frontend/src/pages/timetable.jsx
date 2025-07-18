import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css"; // or create Timetable.css for better separation

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Reusable timetable table renderer
function TimetableTable({ label, data, periodCount }) {
  return (
    <div className="time-card">
      <h3>{label}</h3>
      <table>
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
                <td key={pIndex}>{entry || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TimetablePage() {
  const [data, setData] = useState(null);     // timetable data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/timetable")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch timetable:", err);
        setError("Unable to load timetable.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center", padding: "2rem" }}>{error}</div>;
  }

  if (!data || !data.classes || !data.teachers) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>No timetable available.</div>;
  }

  const periodCount = data.classes[Object.keys(data.classes)[0]][0].length;

  return (
    <div className="hero-bg">
      <h2 style={{ textAlign: "center" }}>Class Timetables</h2>
      {Object.entries(data.classes).map(([className, table]) => (
        <TimetableTable
          key={className}
          label={className}
          data={table}
          periodCount={periodCount}
        />
      ))}

      <h2 style={{ textAlign: "center" }}>Teacher Timetables</h2>
      {Object.entries(data.teachers).map(([teacherName, table]) => (
        <TimetableTable
          key={teacherName}
          label={teacherName}
          data={table}
          periodCount={periodCount}
        />
      ))}
    </div>
  );
}

