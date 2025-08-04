import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Details from "./pages/details";
import TimetablePage from "./pages/timetable";
import Login from "./pages/login";
import ProtectedRoute from "./comp/pr";  // ensure path + file name match

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/details" element={<Details />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/timetable' element={<TimetablePage />} />
      </Route>
      {/* Optional catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
