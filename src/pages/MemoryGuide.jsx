import { useState } from 'react';
import { Layers, Cpu, Server, Database, AlignLeft, Info, ExternalLink, HardDrive, ArrowRightLeft } from 'lucide-react';

const memorySections = [
  { id: 'kernel', name: 'Kernel Space', color: 'bg-red-500/20 border-red-500/50', text: 'text-red-400', h: 'h-16', desc: 'Reserved for the operating system kernel. User-mode applications (like standard programs) cannot read or write to this memory. Trying to do so causes a segmentation fault.' },
  { id: 'stack', name: 'The Stack (Grows ↓)', color: 'bg-blue-500/20 border-blue-500/50', text: 'text-blue-400', h: 'h-24', desc: 'A LIFO (Last-In-First-Out) data structure. It automatically stores local variables, function parameters, and return addresses. It grows DOWNWARDS towards lower memory addresses. When a function finishes, its stack memory is instantly "freed".' },
  { id: 'free', name: 'Unallocated Space', color: 'bg-slate-800/30 border-slate-700 border-dashed', text: 'text-slate-500', h: 'h-32', desc: 'Empty memory space that acts as a buffer. This allows the Stack to grow downward and the Heap to grow upward without immediately colliding.' },
  { id: 'heap', name: 'The Heap (Grows ↑)', color: 'bg-emerald-500/20 border-emerald-500/50', text: 'text-emerald-400', h: 'h-24', desc: 'Used for dynamic memory allocation (e.g. malloc in C). This memory is manually managed by the programmer and grows UPWARDS towards higher addresses. Memory leaks happen when you forget to free data here.' },
  { id: 'bss', name: '.bss (Uninitialized Data)', color: 'bg-yellow-500/20 border-yellow-500/50', text: 'text-yellow-400', h: 'h-16', desc: 'Stores global and static variables that have NOT been explicitly initialized by the programmer (e.g., int global_var;). They are automatically zeroed out.' },
  { id: 'data', name: '.data (Initialized Data)', color: 'bg-orange-500/20 border-orange-500/50', text: 'text-orange-400', h: 'h-16', desc: 'Stores global and static variables that HAVE been initialized by the programmer with specific values (e.g., int global_var = 10;).' },
  { id: 'text', name: '.text (Code)', color: 'bg-purple-500/20 border-purple-500/50', text: 'text-purple-400', h: 'h-20', desc: 'The actual compiled Assembly instructions of the program. This section is generally marked as Read-Only and Executable to prevent the program from accidentally modifying its own code.' },
];

export default function MemoryGuide() {
  const [activeTab, setActiveTab] = useState('intro');
  const [activeSection, setActiveSection] = useState(memorySections[1]); // Default to stack

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto pb-12">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">Architecture & System Guide</h2>
          <p className="text-slate-400">A visual introduction to how programs actually live inside the computer's memory.</p>
        </div>
        <a href="https://syscalls.w3challs.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-600/20 text-blue-400 font-bold px-5 py-3 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition-colors shadow-lg shadow-blue-900/20">
          <Database size={18} />
          Syscall Reference
          <ExternalLink size={16} />
        </a>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 mb-8 bg-slate-900/50 p-2 rounded-xl border border-slate-800/80 shadow-inner">
        <button onClick={() => setActiveTab('intro')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'intro' ? 'bg-slate-800 text-white shadow border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>1. Intro to ASM</button>
        <button onClick={() => setActiveTab('memory')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'memory' ? 'bg-slate-800 text-white shadow border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>2. Memory Layout</button>
        <button onClick={() => setActiveTab('registers')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'registers' ? 'bg-slate-800 text-white shadow border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>3. CPU Registers</button>
        <button onClick={() => setActiveTab('data')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'data' ? 'bg-slate-800 text-white shadow border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>4. Data & Endianness</button>
        <button onClick={() => setActiveTab('isa')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'isa' ? 'bg-slate-800 text-white shadow border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>5. CISC vs RISC</button>
      </div>

      {activeTab === 'intro' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur-sm">
            <h3 className="text-3xl font-black text-white mb-6 tracking-wide">What is Assembly Language?</h3>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Assembly (ASM) is not a single language. It is a family of low-level programming languages where there is a very strong, almost one-to-one correspondence between the code you read and the machine code instructions the hardware executes.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 text-center relative">
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hidden md:block">→</div>
                <h4 className="text-blue-400 font-bold mb-3 uppercase tracking-widest text-sm">High-Level (C/C++)</h4>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-blue-200 border border-slate-800">
                  int x = 5 + 5;
                </div>
                <p className="text-slate-400 text-xs mt-3">Human readable, hardware agnostic.</p>
              </div>
              
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 text-center relative">
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hidden md:block">→</div>
                <h4 className="text-emerald-400 font-bold mb-3 uppercase tracking-widest text-sm">Assembly (ASM)</h4>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-emerald-200 border border-slate-800">
                  add eax, 5
                </div>
                <p className="text-slate-400 text-xs mt-3">Human readable, hardware specific.</p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 text-center">
                <h4 className="text-red-400 font-bold mb-3 uppercase tracking-widest text-sm">Machine Code</h4>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-red-200 border border-slate-800">
                  83 C0 05
                </div>
                <p className="text-slate-400 text-xs mt-3">Hardware readable raw bytes.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-2xl font-bold text-white mb-4">Structure of an Instruction</h4>
                <p className="text-slate-400 mb-6">Every line of Assembly is generally composed of two things: a <strong className="text-emerald-400">Mnemonic</strong> (the action to perform) and <strong className="text-blue-400">Operands</strong> (the data or targets to perform the action on).</p>
                
                <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 font-mono text-lg text-center shadow-inner">
                  <span className="text-emerald-400 font-bold">mov</span> <span className="text-blue-400">rax</span>, <span className="text-blue-400">1</span>
                </div>
                <p className="text-center text-slate-500 text-sm mt-3">"Move the value 1 into the rax register"</p>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-white mb-4">Why learn it?</h4>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                    <p><strong>Reverse Engineering:</strong> When you analyze malware or proprietary software, you don't have the C source code. You only have the binary (Machine Code). Disassemblers translate that binary back into Assembly so you can read it.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2"></div>
                    <p><strong>Exploit Development:</strong> Writing shellcode requires manually crafting Assembly instructions that fit perfectly into tight memory spaces to hijack execution flows.</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
              <h4 className="text-2xl font-bold text-white mb-6">Common x86 Instructions</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-black/40 p-4 rounded-lg border border-slate-800 shadow-inner">
                  <span className="text-emerald-400 font-mono font-bold text-lg">mov</span>
                  <p className="text-slate-400 text-sm mt-2">Moves data from a source to a destination. Ex: <code className="text-blue-300">mov eax, 5</code> (Set eax to 5)</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-slate-800 shadow-inner">
                  <span className="text-emerald-400 font-mono font-bold text-lg">add / sub</span>
                  <p className="text-slate-400 text-sm mt-2">Adds or subtracts values. Ex: <code className="text-blue-300">add rax, rbx</code> (rax = rax + rbx)</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-slate-800 shadow-inner">
                  <span className="text-emerald-400 font-mono font-bold text-lg">cmp</span>
                  <p className="text-slate-400 text-sm mt-2">Compares two values by subtracting them behind the scenes to set CPU flags. Used before jumps.</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-slate-800 shadow-inner">
                  <span className="text-emerald-400 font-mono font-bold text-lg">jmp / je / jne</span>
                  <p className="text-slate-400 text-sm mt-2">Jumps to a different part of the code. <code className="text-blue-300">jmp</code> is unconditional, <code className="text-blue-300">je</code> jumps if equal, <code className="text-blue-300">jne</code> jumps if not equal.</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-slate-800 shadow-inner">
                  <span className="text-emerald-400 font-mono font-bold text-lg">push / pop</span>
                  <p className="text-slate-400 text-sm mt-2">Pushes a value onto the top of the stack, or pops the top value off the stack into a register.</p>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-slate-800 shadow-inner">
                  <span className="text-emerald-400 font-mono font-bold text-lg">call / ret</span>
                  <p className="text-slate-400 text-sm mt-2"><code className="text-blue-300">call</code> jumps to a function and saves the return address. <code className="text-blue-300">ret</code> pops that address and goes back.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'memory' && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between text-xs text-slate-500 font-mono mb-2 px-2">
            <span>High Memory (0xFFFFFFFF)</span>
          </div>

          {memorySections.map((sec) => (
            <div key={sec.id} className="flex flex-col md:flex-row gap-6 items-stretch bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div className={`md:w-64 flex-shrink-0 border-2 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner min-h-[100px] ${sec.color} ${sec.text}`}>
                {sec.name}
              </div>
              <div className="flex-1 flex flex-col justify-center py-2">
                <h3 className={`text-xl font-bold mb-2 ${sec.text}`}>{sec.id.toUpperCase()}</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{sec.desc}</p>
                {sec.id === 'stack' && (
                  <div className="mt-4 bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg text-blue-200 font-mono text-sm inline-block">
                    💡 Tip: Buffer overflows target the Stack to overwrite the saved return address (RIP).
                  </div>
                )}
                {sec.id === 'heap' && (
                  <div className="mt-4 bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg text-emerald-200 font-mono text-sm inline-block">
                    💡 Tip: Heap exploits like Use-After-Free target the dynamic allocator structures.
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between text-xs text-slate-500 font-mono mt-2 px-2">
            <span>Low Memory (0x00000000)</span>
          </div>
        </div>
      )}

      {activeTab === 'registers' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Cpu className="text-pink-400" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">x86-64 Sub-Registers</h3>
                <p className="text-slate-400 mt-1">Registers are hardware storage inside the CPU. A 64-bit register can be accessed in smaller chunks (32-bit, 16-bit, 8-bit).</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-700">
                    <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-sm">Description</th>
                    <th className="p-4 text-pink-400 font-bold uppercase tracking-wider text-sm">64-bit (8 bytes)</th>
                    <th className="p-4 text-pink-300 font-bold uppercase tracking-wider text-sm">32-bit (4 bytes)</th>
                    <th className="p-4 text-pink-200 font-bold uppercase tracking-wider text-sm">16-bit (2 bytes)</th>
                    <th className="p-4 text-pink-100 font-bold uppercase tracking-wider text-sm">8-bit (1 byte)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="bg-slate-800/30">
                    <td colSpan="5" className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/30">Data & Argument Registers</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Syscall Number / Return Value</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rax</td>
                    <td className="p-4 font-mono text-pink-300">eax</td>
                    <td className="p-4 font-mono text-pink-200">ax</td>
                    <td className="p-4 font-mono text-pink-100">al</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Callee Saved / Base</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rbx</td>
                    <td className="p-4 font-mono text-pink-300">ebx</td>
                    <td className="p-4 font-mono text-pink-200">bx</td>
                    <td className="p-4 font-mono text-pink-100">bl</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">1st Arg - Destination Index</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rdi</td>
                    <td className="p-4 font-mono text-pink-300">edi</td>
                    <td className="p-4 font-mono text-pink-200">di</td>
                    <td className="p-4 font-mono text-pink-100">dil</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">2nd Arg - Source Index</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rsi</td>
                    <td className="p-4 font-mono text-pink-300">esi</td>
                    <td className="p-4 font-mono text-pink-200">si</td>
                    <td className="p-4 font-mono text-pink-100">sil</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">3rd Arg - Data</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rdx</td>
                    <td className="p-4 font-mono text-pink-300">edx</td>
                    <td className="p-4 font-mono text-pink-200">dx</td>
                    <td className="p-4 font-mono text-pink-100">dl</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">4th Arg - Loop Counter</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rcx</td>
                    <td className="p-4 font-mono text-pink-300">ecx</td>
                    <td className="p-4 font-mono text-pink-200">cx</td>
                    <td className="p-4 font-mono text-pink-100">cl</td>
                  </tr>
                  <tr className="bg-slate-800/30">
                    <td colSpan="5" className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/30">Pointer Registers</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Base Stack Pointer</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rbp</td>
                    <td className="p-4 font-mono text-pink-300">ebp</td>
                    <td className="p-4 font-mono text-pink-200">bp</td>
                    <td className="p-4 font-mono text-pink-100">bpl</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Current/Top Stack Pointer</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rsp</td>
                    <td className="p-4 font-mono text-pink-300">esp</td>
                    <td className="p-4 font-mono text-pink-200">sp</td>
                    <td className="p-4 font-mono text-pink-100">spl</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Instruction Pointer</td>
                    <td className="p-4 font-mono font-bold text-pink-400">rip</td>
                    <td className="p-4 font-mono text-pink-300">eip</td>
                    <td className="p-4 font-mono text-pink-200">ip</td>
                    <td className="p-4 font-mono text-pink-100">ipl</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-400 text-sm leading-relaxed">
                <strong className="text-slate-200">Rule of Thumb:</strong> Even if you are analyzing a 64-bit binary, the compiler will frequently use 32-bit (<code className="text-pink-300">eax</code>) or 8-bit (<code className="text-pink-100">al</code>) registers to optimize performance and save space if the data being processed doesn't strictly require 64 bits. 
              </p>
            </div>
          </div>

          {/* ARM Registers */}
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Cpu className="text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">ARM (AArch64) Registers</h3>
                <p className="text-slate-400 mt-1">ARM uses a much simpler, uniform numbering scheme for its general-purpose registers compared to x86.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-700">
                    <th className="p-4 text-slate-300 font-bold uppercase tracking-wider text-sm">Description</th>
                    <th className="p-4 text-orange-400 font-bold uppercase tracking-wider text-sm">64-bit Register</th>
                    <th className="p-4 text-orange-300 font-bold uppercase tracking-wider text-sm">32-bit Register</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="bg-slate-800/30">
                    <td colSpan="3" className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/30">General & Arguments</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Arguments & Return Value (1st - 8th arg)</td>
                    <td className="p-4 font-mono font-bold text-orange-400">X0 - X7</td>
                    <td className="p-4 font-mono text-orange-300">W0 - W7</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Temporary / Caller Saved</td>
                    <td className="p-4 font-mono font-bold text-orange-400">X9 - X15</td>
                    <td className="p-4 font-mono text-orange-300">W9 - W15</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Callee Saved (Must preserve)</td>
                    <td className="p-4 font-mono font-bold text-orange-400">X19 - X28</td>
                    <td className="p-4 font-mono text-orange-300">W19 - W28</td>
                  </tr>
                  <tr className="bg-slate-800/30">
                    <td colSpan="3" className="p-3 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/30">Special Purpose Pointers</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Frame Pointer (FP)</td>
                    <td className="p-4 font-mono font-bold text-orange-400">X29</td>
                    <td className="p-4 font-mono text-orange-300">W29</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Link Register (LR) - Holds Return Address!</td>
                    <td className="p-4 font-mono font-bold text-orange-400 text-lg">X30</td>
                    <td className="p-4 font-mono text-orange-300">W30</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Stack Pointer (SP)</td>
                    <td className="p-4 font-mono font-bold text-orange-400">SP</td>
                    <td className="p-4 font-mono text-orange-300">-</td>
                  </tr>
                  <tr className="hover:bg-slate-800/80 transition-colors">
                    <td className="p-4 text-slate-300">Program Counter (PC)</td>
                    <td className="p-4 font-mono font-bold text-orange-400">PC</td>
                    <td className="p-4 font-mono text-orange-300">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-400 text-sm leading-relaxed">
                <strong className="text-slate-200">Critical ARM Difference:</strong> In x86, the return address is pushed onto the stack automatically when a function is called. In ARM, the return address is stored in the <strong className="text-orange-400">Link Register (X30)</strong>. It is only pushed to the stack if the function calls another function!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <ArrowRightLeft className="text-yellow-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Endianness</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">Endianness dictates the order in which bytes are stored in memory for multi-byte data types (like a 4-byte integer).</p>
            
            <div className="space-y-6">
              <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-yellow-400 mb-2">Little-Endian (x86, ARM)</h4>
                <p className="text-slate-400 text-sm mb-4">The Least Significant Byte (LSB) is stored at the lowest memory address. This looks "backwards" to humans when reading hex dumps.</p>
                <div className="bg-black/50 p-3 rounded font-mono text-sm text-slate-300 text-center border border-slate-800">
                  Value: <span className="text-white">0xDEADBEEF</span> <br/>
                  Memory: <span className="text-yellow-400">EF BE AD DE</span>
                </div>
              </div>

              <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-emerald-400 mb-2">Big-Endian (Networking)</h4>
                <p className="text-slate-400 text-sm mb-4">The Most Significant Byte (MSB) is stored at the lowest memory address. This is how humans naturally read numbers.</p>
                <div className="bg-black/50 p-3 rounded font-mono text-sm text-slate-300 text-center border border-slate-800">
                  Value: <span className="text-white">0xDEADBEEF</span> <br/>
                  Memory: <span className="text-emerald-400">DE AD BE EF</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Database className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">C Data Types</h3>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">Understanding how many bytes a data type consumes is critical for buffer overflow math and pointer arithmetic.</p>
            
            <ul className="space-y-3">
              <li className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <span className="font-mono text-cyan-400 font-bold">char</span>
                <span className="text-slate-300">1 byte (8 bits)</span>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <span className="font-mono text-cyan-400 font-bold">short</span>
                <span className="text-slate-300">2 bytes (16 bits)</span>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <span className="font-mono text-cyan-400 font-bold">int</span>
                <span className="text-slate-300">4 bytes (32 bits)</span>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <span className="font-mono text-cyan-400 font-bold">long long</span>
                <span className="text-slate-300">8 bytes (64 bits)</span>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <span className="font-mono text-cyan-400 font-bold">Pointers (*p)</span>
                <span className="text-slate-300">8 bytes (on 64-bit OS)</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'isa' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <HardDrive className="text-emerald-400" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Instruction Set Architectures (ISA)</h3>
                <p className="text-slate-400 mt-1">The philosophy of how the CPU reads, writes, and executes instructions.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-2xl font-black text-emerald-400 mb-2 tracking-wider">CISC</h4>
                <h5 className="text-white font-bold mb-4">Complex Instruction Set Computer</h5>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Used by Intel and AMD (x86, x86_64). CISC aims to complete a task in as few lines of assembly as possible. A single instruction can simultaneously fetch data from memory, perform math on it, and write it back to memory. The hardware is complex so the software can be simple.
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <h4 className="text-2xl font-black text-blue-400 mb-2 tracking-wider">RISC</h4>
                <h5 className="text-white font-bold mb-4">Reduced Instruction Set Computer</h5>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Used by ARM (Apple Silicon, Mobile) and MIPS. RISC requires instructions to be extremely simple and fixed in length (usually 4 bytes). You cannot perform math directly on memory. You must load it to a register, calculate, and store it back. The software is complex so the hardware can be fast and simple.
                </p>
              </div>
            </div>

            {/* Visual Example */}
            <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 mt-6">
              <h4 className="text-lg font-bold text-white mb-6 text-center">Visual Example: "Multiply two numbers in memory"</h4>
              
              <div className="grid md:grid-cols-2 gap-12">
                {/* CISC Visual */}
                <div className="flex flex-col items-center">
                  <h5 className="font-bold text-emerald-400 mb-4">CISC (x86) Approach</h5>
                  
                  <div className="w-full bg-slate-800 p-4 rounded-lg border border-slate-600 mb-4 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                    <span className="font-mono font-bold text-lg text-white relative z-10">IMUL [addr1], [addr2]</span>
                  </div>
                  
                  <div className="text-emerald-400 font-bold mb-2">↓</div>
                  
                  <div className="w-full flex justify-between gap-2 text-center text-xs">
                    <div className="bg-emerald-900/30 border border-emerald-700 p-2 rounded flex-1">1. Fetch A</div>
                    <div className="bg-emerald-900/30 border border-emerald-700 p-2 rounded flex-1">2. Fetch B</div>
                    <div className="bg-emerald-900/30 border border-emerald-700 p-2 rounded flex-1">3. Multiply</div>
                    <div className="bg-emerald-900/30 border border-emerald-700 p-2 rounded flex-1">4. Store A</div>
                  </div>
                  <p className="text-slate-500 text-xs mt-4 text-center">One complex instruction does all the work directly in memory.</p>
                </div>

                {/* RISC Visual */}
                <div className="flex flex-col items-center">
                  <h5 className="font-bold text-blue-400 mb-4">RISC (ARM) Approach</h5>
                  
                  <div className="w-full space-y-2 mb-4">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 text-center flex justify-between px-4 group">
                      <span className="text-slate-500 text-sm w-8">1.</span>
                      <span className="font-mono font-bold text-white">LDR R1, [addr1]</span>
                      <span className="text-blue-400 text-xs mt-1 w-20 text-right">Load A</span>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 text-center flex justify-between px-4 group">
                      <span className="text-slate-500 text-sm w-8">2.</span>
                      <span className="font-mono font-bold text-white">LDR R2, [addr2]</span>
                      <span className="text-blue-400 text-xs mt-1 w-20 text-right">Load B</span>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 text-center flex justify-between px-4 group">
                      <span className="text-slate-500 text-sm w-8">3.</span>
                      <span className="font-mono font-bold text-white">MUL R3, R1, R2</span>
                      <span className="text-blue-400 text-xs mt-1 w-20 text-right">Multiply</span>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 text-center flex justify-between px-4 group">
                      <span className="text-slate-500 text-sm w-8">4.</span>
                      <span className="font-mono font-bold text-white">STR R3, [addr1]</span>
                      <span className="text-blue-400 text-xs mt-1 w-20 text-right">Store Result</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 text-center">Four simple instructions are required. Memory manipulation is strictly isolated to Load/Store instructions.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
