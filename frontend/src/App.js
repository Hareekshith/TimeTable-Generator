import { Routes, Route } from 'react-router-dom';
import Home from './pages/home'; // or './pages/home/Home' if using folders

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;

