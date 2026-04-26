import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Converter from './pages/Converter';
import Tutor from './pages/Tutor';
import Scanner from './pages/Scanner';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-900 text-white">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-slate-800 p-6 border-r border-slate-700">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-400">ByteBench</h1>
            <p className="text-sm text-slate-400">Security Tools</p>
          </div>
          <ul className="space-y-4">
            <li>
              <Link to="/converter" className="hover:text-blue-300 transition-colors">Quick Converter</Link>
            </li>
            <li>
              <Link to="/tutor" className="hover:text-blue-300 transition-colors">C-to-ASM Tutor</Link>
            </li>
            <li>
              <Link to="/scanner" className="hover:text-blue-300 transition-colors">Triage Scanner</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<div className="text-xl">Welcome to ByteBench. Select a tool from the sidebar.</div>} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
