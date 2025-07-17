import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Details from "./pages/details"
import TimetablePage from "./pages/timetable"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details" element={<Details />} />
      <Route path='/timetable' element={<TimetablePage />} />
    </Routes>
  );
}

export default App
