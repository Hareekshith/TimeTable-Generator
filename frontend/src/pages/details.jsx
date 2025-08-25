import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth,db } from "../firebase";
import "./Home.css";
import axios from "axios";

function Details() {
  const [noper, setNoper] = useState(0);
  const [teacher, setTeacher] = useState({ name: "", subject: "" });
  const [teachli, setTeachli] = useState([]);
  const [cla, setCla] = useState({ name: "", details: "" });
  const [clali, setClali] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const handleAccessFlag = useState(false);

	useEffect(() => {
	  const fetchUserData = async () => {
	    const user = auth.currentUser;
	    if (!user) return;
	    const userDoc = doc(db, "users", user.uid);
	    const docSnap = await getDoc(userDoc);
	    if (docSnap.exists()) {
	      const data = docSnap.data();
	      if (data.noper) setNoper(data.noper);
	      if (data.teachli) setTeachli(data.teachli);
	      if (data.clali) setClali(data.clali);
	      if (data.submitted !== undefined) setSubmitted(data.submitted);
	    }
	  };
	  fetchUserData();
	}, []);
  useEffect(() => {
  const saveUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), {
      noper,
      teachli,
      clali,
      submitted,
    }, { merge: true });
  };
  saveUserData();
}, [noper, teachli, clali, submitted]);


  function handleAddSlot(e) {
    e.preventDefault(); // Prevent page reload
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
	async function handleSubmit(e) {
	  e.preventDefault();
	  const allData = { teachers: teachli, classes: clali, noslot: noper };
	  try {
	    const user = auth.currentUser;
	    if (!user) {
	      alert("Not logged in");
	      return;
	    }
	    const token = await user.getIdToken(/* forceRefresh= */ true);
	    const response = await axios.post(
	      'http://localhost:5000/api/generate',
	      { dic: allData },
	      {
	        headers: {
	          Authorization: `Bearer ${token}`,
	        },
	        // withCredentials: false, // Not needed for token-based auth
	      }
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
	    if (
	      error.response &&
	      error.response.data &&
	      error.response.data.error
	    ) {
	      alert("Error: " + error.response.data.error);
	    } else {
	      alert("Unknown Submission Error");
	    }
	  }
	}
	async function handleReset() {
	  if (!window.confirm("Clear all data?")) return;
	  // Clear React state
	  setTeachli([]);
	  setClali([]);
	  setTeacher({ name: "", subject: "" });
	  setCla({ name: "", details: "" });
	  setSubmitted(false);
	  setNoper("");
	  // Reset Firestore user data to empty/default
	  const user = auth.currentUser;
	  if (user) {
	    await setDoc(doc(db, "users", user.uid), {
	      teachli: [],
	      clali: [],
	      submitted: false,
	      noper: "",
	    }, { merge: true }); // merge ensures only specified fields reset
	  }
	}

  return (
    <div className="hero-bg">
      <Link to="/" className="cta-btn" id="dd" style={{gridColumn: "1/2", marginTop: "1rem", justifySelf: "left", marginLeft: "1rem", height: "maxContent"}}>&lt;-</Link>
      <div className="home-card" style={{gridColumn: "1/span 2"}}>
        <form onSubmit={handleAddSlot}>
          <label htmlFor="no-periods">Number of slots per day</label>
          <input
            type="text"
            value={noper}
            placeholder="No. of slots "
            onChange={e =>
              setNoper(parseInt(e.target.value || 0))
            }
          />
            <button type="submit">Set</button>
        </form>
      </div>
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
      <Link to="/timetable" className="cta-btn">View TimeTable</Link>
    </div>
  );
}

export default Details;
