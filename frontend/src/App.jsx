import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Details from "./pages/details";
import TimetablePage from "./pages/timetable";
import Login from "./pages/login";
import ProtectedRoute from "./comp/pr"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/details" element={<Details />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/timetable' element={<TimetablePage />} />
      </Route>
    </Routes>
  );
}

export default App
