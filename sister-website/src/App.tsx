import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 修正路徑：Navbar 在 components/Navbar 資料夾下
import Navbar from './components/Navbar/Navbar'; 
// 修正路徑：Home 與 About 在 pages 資料夾下
import Home from './pages/Home';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}