import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="hero-bg">
      <div className="home-card">
        <h1>School Timetable Generator</h1>
        <p className="subtitle">
          Effortlessly create balanced, conflict-free class timetables.<br />
          Fast, simple, and customizable for any school!
        </p>
        <Link to="/login" className="cta-btn">
          Get Started
        </Link>
        <div className="features">
          <div>
            <span role="img" aria-label="No Overlap">✅</span>
            No subject overlaps
          </div>
          <div>
            <span role="img" aria-label="Custom">⚙️</span>
            Fully customizable
          </div>
          <div>
            <span role="img" aria-label="clean">🧹</span>
            Neat and elegant
          </div>
        </div>
        <div className="how-works" style={{ textAlign: "left", margin: "1rem auto", maxWidth: "400px", color: "var(--text-muted)" }}>
          <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>How it works:</h3>
          <ol style={{ paddingLeft: "1.5rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Enter your subjects and schedule details</li>
            <li>Click "Generate" to create your timetable</li>
          </ol>
        </div>
        <footer style={{ marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          &copy; 2025 Hareekshith —{" "}
          <a href="https://github.com/hareekshith" target="_blank" rel="noreferrer">GitHub</a>
        </footer>
      </div>
    </div>
  );
}

export default Home;
