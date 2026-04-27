import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, FileCode2, BookOpen, Shield, Server, Terminal, Link } from 'lucide-react';
import Home from './pages/Home';
import Converter from './pages/Converter';
import Tutor from './pages/Tutor';
import Scanner from './pages/Scanner';
import MemoryGuide from './pages/MemoryGuide';
import Resources from './pages/Resources';

function App() {
  // Persistent Scanner State
  const [scannerResult, setScannerResult] = useState(null);
  const [scannerExpectedHash, setScannerExpectedHash] = useState('');
  const [isScannerWasmLoaded, setIsScannerWasmLoaded] = useState(false);
  const [scannerWasmError, setScannerWasmError] = useState(null);

  // Load Scanner Wasm Engine at App level
  useEffect(() => {
    if (window.RevBench_parseBinary) {
      setIsScannerWasmLoaded(true);
      return;
    }

    const loadWasm = async () => {
      try {
        const go = new window.Go();
        const response = await fetch('/wasm/scanner.wasm');
        if (!response.ok) throw new Error("Wasm file not found");
        const buffer = await response.arrayBuffer();
        const result = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(result.instance);
        setIsScannerWasmLoaded(true);
      } catch (err) {
        console.error("Failed to load Wasm", err);
        setScannerWasmError("Failed to load WebAssembly engine.");
      }
    };
    
    // Small delay to ensure Go is available from script tag
    const timer = setTimeout(() => {
      if (window.Go) {
        loadWasm();
      } else {
        setScannerWasmError("wasm_exec.js not found on window object");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 transition-all duration-300 font-medium ${
      isActive 
        ? 'bg-gradient-to-r from-[#00d4ff]/15 to-transparent text-[#00d4ff] border-l-2 border-[#00d4ff]' 
        : 'text-gray-400 hover:bg-[#151e2d] hover:text-gray-200 border-l-2 border-transparent'
    }`;

  return (
    <Router>
      <div className="flex h-screen bg-[#0b101e] text-gray-200 font-sans overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-72 bg-[#0b101e]/95 backdrop-blur-md border-r border-[#1f2937] flex flex-col z-20 shadow-2xl shadow-black/50">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
              <img src="/logo.png" alt="RevBench Logo" className="w-12 h-12 rounded-full object-cover border-2 border-[#00d4ff] shadow-lg shadow-[#00d4ff]/20" />
              <h1 className="text-3xl font-black tracking-tight text-white">RevBench</h1>
            </div>
            
            <ul className="space-y-1 flex-1">
              <li>
                <NavLink to="/" className={navLinkClass}>
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <div className="pt-6 pb-2">
                <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tools</p>
              </div>
              <li>
                <NavLink to="/converter" className={navLinkClass}>
                  <FileCode2 size={18} />
                  <span>Quick Converter</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/tutor" className={navLinkClass}>
                  <BookOpen size={18} />
                  <span>C-to-ASM Tutor</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/scanner" className={navLinkClass}>
                  <Shield size={18} />
                  <span>Static Analyzer</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/memory" className={navLinkClass}>
                  <Server size={18} />
                  <span>Architecture Guide</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/resources" className={navLinkClass}>
                  <Link size={18} />
                  <span>Resources</span>
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div className="mt-auto p-6 text-sm text-gray-500 font-medium border-t border-[#1f2937]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#00d4ff]"></div>
              <span>Engine Status: Online</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs">v1.0.0-beta</p>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Created by n1ghtwa1k3r</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-[#0b101e]">
          <div className="p-8 h-full w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/converter" element={<Converter />} />
              <Route path="/tutor" element={<Tutor />} />
              <Route 
                path="/scanner" 
                element={
                  <Scanner 
                    result={scannerResult} 
                    setResult={setScannerResult}
                    expectedHash={scannerExpectedHash}
                    setExpectedHash={setScannerExpectedHash}
                    isWasmLoaded={isScannerWasmLoaded}
                    error={scannerWasmError}
                    setError={setScannerWasmError}
                  />
                } 
              />
              <Route path="/memory" element={<MemoryGuide />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </div>
        </div>

      </div>
    </Router>
  );
}

export default App;
