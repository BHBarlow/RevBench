import { ExternalLink, Book, Cpu, Wrench, TerminalSquare, Globe } from 'lucide-react';

export default function Resources() {
  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Learning Resources</h2>
        <p className="text-slate-400">
          Diving into low-level C and Assembly is a phenomenal way to deeply understand how systems actually execute code, especially when you are looking at binaries from the inside out and need to know exactly what the hardware is doing.
        </p>
        <p className="text-slate-400 mt-4">
          Here is a curated list of high-quality, highly practical resources broken down by focus area:
        </p>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Section 1 */}
        <div className="bg-[#111928] p-6 rounded-sm border border-[#1f2937]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1f2937]">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Book className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">1. Low-Level C and OS Internals</h3>
              <p className="text-slate-400 mt-1">To master low-level C, you need to understand how it interfaces with memory and the operating system itself.</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a href="https://sysprog21.github.io/lkmpg/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Linux Kernel Module Guide <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">If you want to write C that interacts directly with kernel space, handles process tracing, or talks directly to hardware interfaces, this is the definitive starting point.</p>
            </a>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-[#111928] p-6 rounded-sm border border-[#1f2937]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1f2937]">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Cpu className="text-emerald-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">2. Assembly Language (ASM) & Architecture</h3>
              <p className="text-slate-400 mt-1">Reading and writing ASM requires picking an architecture. x86_64 is the standard for servers and desktops, while ARM is crucial for embedded devices.</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <a href="https://azeria-labs.com/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Azeria Labs: ARM Basics <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">ARM is the backbone of IoT, mobile, and vehicle telematics. Azeria's guides are the gold standard for getting comfortable with ARM registers, memory instructions, and execution flow.</p>
            </a>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-[#111928] p-6 rounded-sm border border-[#1f2937]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1f2937]">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Wrench className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">3. Applied Practice (Reversing & Debugging)</h3>
              <p className="text-slate-400 mt-1">The fastest way to learn low-level code is to step through it dynamically, break it, and manipulate it.</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a href="https://pwn.college/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Pwn.college <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">An incredible, hands-on platform. The "Assembly Crash Course" and "Memory Errors" modules will force you to get intimately familiar with pwndbg, register states, and memory manipulation in a live environment.</p>
            </a>

            <a href="https://guyinatuxedo.github.io/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Nightmare <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">A fantastic course that walks through using debuggers and decompilers (like Ghidra) to analyze compiled C code, understand how it translates to assembly, and manipulate its execution flow.</p>
            </a>

            <a href="https://microcorruption.com/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Microcorruption <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">A beautifully designed, interactive wargame where you are given a debugger and have to reverse engineer simulated embedded devices using MSP430 assembly to bypass smart locks.</p>
            </a>

            <a href="https://ropemporium.com/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                ROP Emporium <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">The absolute best gamified platform for learning Return-Oriented Programming. You are given vulnerable binaries and must chain together snippets of Assembly (gadgets) to hijack execution flow. It strips away environment setup and forces you to focus entirely on ASM.</p>
            </a>

            <a href="https://p.ost2.fyi/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                OpenSecurityTraining2 <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">Free, deeply technical, and structured courses covering reverse engineering, vulnerability research, and low-level system architecture.</p>
            </a>

            <a href="https://github.com/RPISEC/MBE" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Modern Binary Exploitation (MBE) <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">The legendary course materials from RPISEC. Provides lectures, labs, and projects that will take you from basic reverse engineering to advanced binary exploitation.</p>
            </a>

            <a href="https://ir0nstone.gitbook.io/notes" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                ir0nstone's Notes <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">An incredibly accessible, easy-to-read, and comprehensive guide for binary exploitation (pwn). Covers classic attacks like buffer overflows, format strings, and heap exploitation.</p>
            </a>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-[#111928] p-6 rounded-sm border border-[#1f2937]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1f2937]">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <TerminalSquare className="text-pink-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">4. Highly Interactive Learning Paths</h3>
              <p className="text-slate-400 mt-1">Hands-on platforms and sandbox environments where you can write code and see the direct low-level results.</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a href="https://academy.hackthebox.com/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                HTB Academy <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">Provides a full browser-based "Pwnbox" where you write code in a live Linux environment that the platform grades in real-time. The Assembly module focuses on x86_64, manipulating registers and understanding calling conventions.</p>
            </a>

            <a href="https://godbolt.org/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Compiler Explorer <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">The ultimate interactive sandbox for understanding the relationship between C and ASM. Write C code in the left pane, and it compiles to Assembly in the right pane in real-time, completely color-coded.</p>
            </a>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-[#111928] p-6 rounded-sm border border-[#1f2937]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1f2937]">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Globe className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">5. Browser-Based C Environments</h3>
              <p className="text-slate-400 mt-1">Practice and write pure C code without having to configure a local development environment.</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a href="https://coddy.tech/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Coddy.tech <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">Drill pure C concepts (structs, pointers, memory allocation) without managing GCC locally. Provides a browser-based compiler with gamified challenges that flags memory leaks and segfaults in real-time.</p>
            </a>

            <a href="https://lowlevel.academy/" target="_blank" rel="noreferrer" className="block bg-[#0b101e] p-5 rounded-sm border border-[#1f2937] hover:border-[#00d4ff] transition-all group">
              <h4 className="text-lg font-bold text-white group-hover:text-[#00d4ff] flex justify-between items-center mb-2">
                Low Level Academy <ExternalLink size={16} />
              </h4>
              <p className="text-sm text-slate-400">Specifically the "Zero2Hero C Programming" track. It is heavily interactive and explicitly avoids "tutorial hell" by focusing right away on systems programming, dynamic memory allocation, and the POSIX API.</p>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
