import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Placeholder from './pages/Placeholder.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Placeholder />} />
      </Routes>
    </Router>
  );
}
