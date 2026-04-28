import { Shield, FileCode2, Cpu, BookOpen, Server, BookText, Link } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col h-full py-8 justify-start max-w-5xl mx-auto relative z-10 overflow-y-auto pb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="flex items-center gap-6 mb-10 border-b border-[#1f2937] pb-8 mt-4">
        <img src="/logo.png" alt="RevBench Logo" className="w-24 h-24 rounded-2xl object-cover border-2 border-[#00d4ff] shadow-[0_0_30px_rgba(0,212,255,0.2)]" />
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-2">
            RevBench
          </h1>
          <h2 className="text-sm font-bold text-[#00d4ff] uppercase tracking-widest">Reverse Engineering & Education Toolkit</h2>
        </div>
      </div>
      
      <p className="text-gray-400 leading-relaxed mb-12 text-lg max-w-4xl">
        RevBench is a comprehensive local environment built for both advanced binary analysis and low-level system education. Everything runs securely within your browser leveraging a custom Go WebAssembly engine.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Tools Section */}
        <div>
          <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-xs border-b border-[#1f2937] pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Active Tools
          </h3>
          <div className="grid gap-4">
            <div className="bg-[#111928] border border-[#1f2937] hover:border-[#00d4ff]/50 p-6 rounded-xl transition-all hover:shadow-lg hover:shadow-[#00d4ff]/10 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#00d4ff]/10 rounded-lg group-hover:bg-[#00d4ff]/20 transition-colors">
                  <Shield className="text-[#00d4ff]" size={24} />
                </div>
                <h4 className="font-bold text-white text-xl group-hover:text-[#00d4ff] transition-colors">Static Analyzer & YARA</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Secure client-side parsing of PE/ELF binaries. View Import Address Tables, extracted strings, Hex dumps, and scan for custom YARA byte patterns without uploading data.</p>
            </div>
            
            <div className="bg-[#111928] border border-[#1f2937] hover:border-emerald-500/50 p-6 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/10 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <FileCode2 className="text-emerald-400" size={24} />
                </div>
                <h4 className="font-bold text-white text-xl group-hover:text-emerald-400 transition-colors">Quick Converter</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Convert data payloads seamlessly between Hex, Decimal, Binary, Base64, and ASCII formats on the fly. Essential for rapid payload crafting.</p>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-xs border-b border-[#1f2937] pb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Learning Resources
          </h3>
          <div className="grid gap-4">
            
            <div className="bg-[#111928] border border-[#1f2937] hover:border-purple-500/50 p-6 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/10 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <Cpu className="text-purple-400" size={24} />
                </div>
                <h4 className="font-bold text-white text-xl group-hover:text-purple-400 transition-colors">Live CPU Simulator</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">Step-by-step interactive simulator to visualize registers, flags, and the stack memory frame dynamically as instructions execute.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111928] border border-[#1f2937] p-5 rounded-xl hover:bg-[#151e2d] transition-colors">
                <BookOpen className="text-yellow-400 mb-3" size={20} />
                <h4 className="font-bold text-white text-sm mb-2">C-to-ASM Tutor</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Learn how C code compiles directly into x86 Assembly instructions.</p>
              </div>
              
              <div className="bg-[#111928] border border-[#1f2937] p-5 rounded-xl hover:bg-[#151e2d] transition-colors">
                <BookText className="text-orange-400 mb-3" size={20} />
                <h4 className="font-bold text-white text-sm mb-2">Opcode Dictionary</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Searchable reference for common x86-64 instructions and flags.</p>
              </div>

              <div className="bg-[#111928] border border-[#1f2937] p-5 rounded-xl hover:bg-[#151e2d] transition-colors">
                <Server className="text-blue-400 mb-3" size={20} />
                <h4 className="font-bold text-white text-sm mb-2">Architecture Guide</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Deep dive documentation on memory layout and registers.</p>
              </div>
              
              <div className="bg-[#111928] border border-[#1f2937] p-5 rounded-xl hover:bg-[#151e2d] transition-colors">
                <Link className="text-pink-400 mb-3" size={20} />
                <h4 className="font-bold text-white text-sm mb-2">External Links</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Curated professional resources and reading materials.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
