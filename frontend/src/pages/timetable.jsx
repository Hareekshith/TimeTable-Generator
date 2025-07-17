import React from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function TimetableTable({ label, data, periodCount }) {
  return (
    <div style={{ marginBottom: "2em" }}>
      <h3>{label}</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ background: "#f0f0f0" }}></th>
            {[...Array(periodCount).keys()].map((p) => (
              <th key={p} style={{ background: "#f0f0f0" }}>Period {p + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((dayRow, dIdx) => (
            <tr key={dIdx}>
              <th style={{ background: "#f0f0f0", fontWeight: 400, textAlign: "left" }}>
                {days[dIdx]}
              </th>
              {dayRow.map((item, pIdx) => (
                <td key={pIdx} style={{ border: "1px solid #ccc", textAlign: "center", padding: "4px 8px" }}>
                  {item || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TimetablePage({ timetableData }) {
  const periodsPerDay =
    timetableData.classes &&
    timetableData.classes[Object.keys(timetableData.classes)[0]][0].length;

  return (
    <div>
      <h2>Class Timetables</h2>
      {Object.entries(timetableData.classes).map(([className, table]) => (
        <TimetableTable
          key={className}
          label={className}
          data={table}
          periodCount={periodsPerDay}
        />
      ))}
      <h2>Teacher Timetables</h2>
      {Object.entries(timetableData.teachers).map(([teacher, table]) => (
        <TimetableTable
          key={teacher}
          label={teacher}
          data={table}
          periodCount={periodsPerDay}
        />
      ))}
    </div>
  );
}

