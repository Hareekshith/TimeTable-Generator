import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Home.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/timetable")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch timetable:", err);
        alert("Unable to load timetable.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
    );
  }

  if (!data || !data.classes || !data.teachers) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        No timetable available.
      </div>
    );
  }

  const periodCount =
    data.classes[Object.keys(data.classes)[0]][0]?.length || 10;

  const handleDownloadPDF = async () => {
    const element = timetableRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("timetable.pdf");
  };
  return (
    <div className="hero-bg" ref={timetableRef}>
      <Link to="/" className="cta-btn" style={{gridColumn: "1/2", marginTop: "1rem", justifySelf: "left", marginLeft: "1rem", height: "maxContent"}}>&lt; Back</Link>
        <h2 style={{ textAlign: "center", gridColumn: "1/span 2" }}>Class Timetables</h2>
        {Object.entries(data.classes).map(([className, table]) => (
          <TimetableTable
            key={className}
            label={className}
            data={table}
            periodCount={periodCount}
          />
        ))}
        <h2 style={{ textAlign: "center", marginTop: "2rem", gridColumn: "1/ span 2" }}>
          Teacher Timetables
        </h2>
        {Object.entries(data.teachers).map(([teacherName, table]) => (
          <TimetableTable
            key={teacherName}
            label={teacherName}
            data={table}
            periodCount={periodCount}
          />
        ))}
      <button onClick={handleDownloadPDF} style={{ marginBottom: "1rem" }}>Print PDF</button>
    </div>
  );
}
