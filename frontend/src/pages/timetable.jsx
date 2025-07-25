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

  useEffect(() => {
    axios
      .get("https://stm-oi1a.onrender.com/api/timetable")
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
      <div className="hero-bg" style={{ display: "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }}>Loading...</div>
    );
  }

  if (!data || !data.classes || !data.teachers) {
    return (
      <div className="hero-bg" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", }}>
        <div className="home-card"><h1>No timetable available.</h1>
        <h2>Incase of building a new timetable, please land on the home screen!</h2>
        <Link to='/' className="cta-btn" style={{marginTop: "4rem"}}>Home</Link></div>
      </div>
    );
  }

  const periodCount =
    data.classes[Object.keys(data.classes)[0]][0]?.length || 10;

  const handleDownloadPDF = async () => {
  const element = timetableRef.current;
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add more pages if needed
  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save("timetable.pdf");
};
  return (
    <div className="hero-bg" ref={timetableRef}>
      <Link to="/details" className="cta-btn" id="dd" style={{gridColumn: "1/2", marginTop: "1rem", justifySelf: "left", marginLeft: "1rem", height: "maxContent"}}>&lt;-</Link>
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

      <button onClick={handleDownloadPDF} style={{ marginBottom: "1rem" }}>Print PDF</button>
    </div>
  );
}
