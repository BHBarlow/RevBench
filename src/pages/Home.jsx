import { ShieldAlert, Terminal, Cpu, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col h-full py-12 justify-center max-w-4xl mx-auto relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="border-t-2 border-t-[#00d4ff] border border-[#1f2937] bg-[#111928]/90 backdrop-blur-sm p-10 lg:p-16 rounded-sm relative overflow-hidden shadow-2xl shadow-black/40">
        
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-8">
            <img src="/logo.png" alt="RevBench Logo" className="w-24 h-24 rounded-full object-cover border-2 border-[#00d4ff] shadow-2xl shadow-[#00d4ff]/30" />
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight">
              RevBench
            </h1>
          </div>
          
          <h2 className="text-xl font-bold text-gray-300 mb-8 uppercase tracking-widest">Reverse Engineering & Education Toolkit</h2>
          
          <p className="text-gray-400 leading-relaxed mb-12 max-w-3xl">
            RevBench is a comprehensive local environment built for both advanced binary analysis and low-level system education. Use the powerful Go WebAssembly engine to tear down executables, or leverage the interactive modules to master CPU architecture, memory layouts, and data conversion.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-[#0b101e] p-6 border-t-2 border-t-[#00d4ff] border border-[#1f2937] flex flex-col shadow-lg shadow-[#00d4ff]/5">
              <Cpu className="text-[#00d4ff] mb-4" size={24} />
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">ASM Architecture</h3>
              <p className="text-xs text-gray-500">Interactive guides on CPU registers, memory layouts, and CISC vs RISC logic.</p>
            </div>
            <div className="bg-[#0b101e] p-6 border-t-2 border-t-[#a855f7] border border-[#1f2937] flex flex-col shadow-lg shadow-[#a855f7]/5">
              <ShieldAlert className="text-[#a855f7] mb-4" size={24} />
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Binary Triage</h3>
              <p className="text-xs text-gray-500">100% Client-Side Wasm analysis. Parse headers and strings with absolute OPSEC.</p>
            </div>
            <div className="bg-[#0b101e] p-6 border border-[#1f2937] flex flex-col">
              <BookOpen className="text-[#00d4ff] mb-4" size={24} />
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Payload Tools</h3>
              <p className="text-xs text-gray-500">Convert data formats on the fly and practice C-to-Assembly reading comprehension.</p>
            </div>
          </div>

          <div className="bg-[#0b101e] border-l-4 border-[#00d4ff] p-6 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Status: Ready</h4>
              <p className="text-gray-500 text-sm">Select a module from the sidebar to initialize.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
