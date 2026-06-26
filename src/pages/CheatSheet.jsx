import { useState } from 'react';
import { Cpu, TerminalSquare, ArrowRightLeft, FileBadge, GitBranch, ShieldAlert, Zap, Layers, Hash, BookText } from 'lucide-react';
import Dictionary from './Dictionary';

const ArchitectureMaps = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h3 className="text-2xl font-bold text-white mb-6 border-b border-[#1f2937] pb-2 flex items-center gap-3">
      <Cpu className="text-blue-400" /> Architecture & Register Maps
    </h3>
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Registers */}
      <div className="bg-[#111928] p-6 rounded-xl border border-[#1f2937] shadow-lg shadow-black/50">
        <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2"><Layers size={18} /> x64 General Purpose Registers</h4>
        <p className="text-sm text-slate-400 mb-4">64-bit registers can be accessed as smaller sub-registers. Modifying the 32-bit (E) register zeros out the upper 32 bits, while modifying 16-bit (A) or 8-bit (AL/AH) leaves higher bits intact.</p>
        
        <div className="space-y-3">
          {[
            { r64: "RAX", r32: "EAX", r16: "AX", r8: "AL / AH", desc: "Accumulator (Return values, math)" },
            { r64: "RBX", r32: "EBX", r16: "BX", r8: "BL / BH", desc: "Base Register (Memory pointers)" },
            { r64: "RCX", r32: "ECX", r16: "CX", r8: "CL / CH", desc: "Counter (Loops, shifts)" },
            { r64: "RDX", r32: "EDX", r16: "DX", r8: "DL / DH", desc: "Data (I/O, arithmetic)" },
            { r64: "RSI", r32: "ESI", r16: "SI", r8: "SIL", desc: "Source Index (String ops)" },
            { r64: "RDI", r32: "EDI", r16: "DI", r8: "DIL", desc: "Destination Index (String ops)" },
            { r64: "RBP", r32: "EBP", r16: "BP", r8: "BPL", desc: "Base Pointer (Stack frames)" },
            { r64: "RSP", r32: "ESP", r16: "SP", r8: "SPL", desc: "Stack Pointer (Top of stack)" },
          ].map((reg, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800">
              <div className="flex bg-[#1a2333] divide-x divide-slate-800 text-center font-mono text-xs sm:w-1/2 shrink-0">
                <div className="flex-1 py-2 px-1 text-white">{reg.r64}</div>
                <div className="flex-1 py-2 px-1 text-blue-300">{reg.r32}</div>
                <div className="flex-1 py-2 px-1 text-emerald-300">{reg.r16}</div>
                <div className="flex-1 py-2 px-1 text-purple-300">{reg.r8}</div>
              </div>
              <div className="py-2 px-4 text-xs text-slate-400 flex items-center">
                {reg.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Registers & Flags */}
      <div className="space-y-6">
        <div className="bg-[#111928] p-6 rounded-xl border border-[#1f2937] shadow-lg shadow-black/50">
          <h4 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><Zap size={18} /> Instruction Pointer</h4>
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
            <div className="flex items-center gap-3 font-mono mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">RIP</span>
              <span className="text-slate-500 text-sm">/</span>
              <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">EIP</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Points to the <strong>next</strong> instruction to be executed. Cannot be modified directly via <code className="text-emerald-300">MOV</code>; it is updated implicitly by instructions like <code className="text-emerald-300">JMP</code>, <code className="text-emerald-300">CALL</code>, and <code className="text-emerald-300">RET</code>.
            </p>
          </div>
        </div>

        <div className="bg-[#111928] p-6 rounded-xl border border-[#1f2937] shadow-lg shadow-black/50">
          <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2"><ShieldAlert size={18} /> Status Flags (RFLAGS)</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { flag: "ZF", name: "Zero Flag", desc: "Set if result is zero. (Used by JE/JZ)" },
              { flag: "CF", name: "Carry Flag", desc: "Set on unsigned overflow. (Used by JB/JA)" },
              { flag: "SF", name: "Sign Flag", desc: "Set if result is negative (MSB is 1)." },
              { flag: "OF", name: "Overflow Flag", desc: "Set on signed overflow. (Used by JL/JG)" },
            ].map((f, idx) => (
              <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <div className="text-red-400 font-bold mb-1 font-mono">{f.flag} <span className="text-slate-500 text-xs font-sans font-normal">- {f.name}</span></div>
                <div className="text-xs text-slate-400">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AssemblyBehavior = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h3 className="text-2xl font-bold text-white mb-6 border-b border-[#1f2937] pb-2 flex items-center gap-3">
      <TerminalSquare className="text-emerald-400" /> Assembly Instruction Behavior
    </h3>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Data vs Address */}
      <div className="bg-[#111928] p-6 rounded-xl border border-[#1f2937] shadow-lg shadow-black/50">
        <h4 className="text-lg font-bold text-emerald-400 mb-4">Data vs. Address: MOV vs. LEA</h4>
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="font-mono text-blue-400 mb-2">MOV RAX, [RBX]</div>
            <p className="text-sm text-slate-400">Dereferences RBX (treats it as a memory pointer), reads the value at that address, and stores it in RAX.</p>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="font-mono text-emerald-400 mb-2">LEA RAX, [RBX+8]</div>
            <p className="text-sm text-slate-400">Does <strong>NOT</strong> dereference memory. It simply calculates the math <code className="text-slate-300">RBX + 8</code> and stores the resulting address in RAX. Used heavily for pointer arithmetic and fast math.</p>
          </div>
        </div>
      </div>

      {/* Bitwise Idioms */}
      <div className="bg-[#111928] p-6 rounded-xl border border-[#1f2937] shadow-lg shadow-black/50">
        <h4 className="text-lg font-bold text-purple-400 mb-4">Common Bitwise Idioms</h4>
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="font-mono text-purple-400 mb-2 flex justify-between">
              <span>XOR EAX, EAX</span>
              <span className="text-xs text-slate-500 border border-slate-700 px-2 rounded-full">Zeroing</span>
            </div>
            <p className="text-sm text-slate-400">The most common way to set a register to zero. It is faster and uses fewer bytes than <code className="text-slate-300">MOV EAX, 0</code>.</p>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="font-mono text-purple-400 mb-2 flex justify-between">
              <span>TEST EAX, EAX</span>
              <span className="text-xs text-slate-500 border border-slate-700 px-2 rounded-full">Check Null</span>
            </div>
            <p className="text-sm text-slate-400">Performs a bitwise AND but discards the result, only updating flags. If EAX is 0, the Zero Flag (ZF) is set. Used right before <code className="text-slate-300">JZ / JE</code>.</p>
          </div>
        </div>
      </div>

      {/* Comparisons & Jumps */}
      <div className="bg-[#111928] p-6 rounded-xl border border-[#1f2937] shadow-lg shadow-black/50 lg:col-span-2">
        <h4 className="text-lg font-bold text-red-400 mb-4">Comparisons & Conditional Jumps</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f2937] text-slate-500 text-sm">
                <th className="pb-3 px-2 font-medium">Jump (Signed)</th>
                <th className="pb-3 px-2 font-medium">Jump (Unsigned)</th>
                <th className="pb-3 px-2 font-medium">Meaning</th>
                <th className="pb-3 px-2 font-medium">Flags Tested</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-slate-300">
              <tr className="border-b border-slate-800/50 hover:bg-slate-900/30">
                <td className="py-3 px-2 text-blue-400">JE / JZ</td>
                <td className="py-3 px-2 text-emerald-400">JE / JZ</td>
                <td className="py-3 px-2 text-slate-400 font-sans">Equal / Zero</td>
                <td className="py-3 px-2">ZF == 1</td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-900/30">
                <td className="py-3 px-2 text-blue-400">JNE / JNZ</td>
                <td className="py-3 px-2 text-emerald-400">JNE / JNZ</td>
                <td className="py-3 px-2 text-slate-400 font-sans">Not Equal / Not Zero</td>
                <td className="py-3 px-2">ZF == 0</td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-900/30">
                <td className="py-3 px-2 text-blue-400">JG / JNLE</td>
                <td className="py-3 px-2 text-emerald-400">JA / JNBE</td>
                <td className="py-3 px-2 text-slate-400 font-sans">Greater / Above</td>
                <td className="py-3 px-2">ZF == 0 & SF == OF</td>
              </tr>
              <tr className="hover:bg-slate-900/30">
                <td className="py-3 px-2 text-blue-400">JL / JNGE</td>
                <td className="py-3 px-2 text-emerald-400">JB / JNAE</td>
                <td className="py-3 px-2 text-slate-400 font-sans">Less / Below</td>
                <td className="py-3 px-2">SF != OF</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </div>
);

const CallingConventions = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h3 className="text-2xl font-bold text-white mb-6 border-b border-[#1f2937] pb-2 flex items-center gap-3">
      <ArrowRightLeft className="text-amber-400" /> Calling Conventions
    </h3>
    
    <p className="text-slate-400 leading-relaxed max-w-4xl">
      A calling convention dictates how arguments are passed to functions and who is responsible for cleaning up the stack afterward. In reverse engineering, knowing these is critical for identifying function arguments.
    </p>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
      
      {/* 64-bit */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#111928] to-[#1a2333] p-6 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <h4 className="text-lg font-bold text-white mb-4 flex justify-between items-center">
            x64 Linux / macOS (System V)
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">64-bit</span>
          </h4>
          <p className="text-sm text-slate-400 mb-4">First 6 integer/pointer arguments are passed in registers. Remaining on stack.</p>
          <div className="flex flex-wrap gap-2 mb-4 font-mono text-sm">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded">1: RDI</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded">2: RSI</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded">3: RDX</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded">4: RCX</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded">5: R8</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded">6: R9</span>
          </div>
          <div className="text-xs text-slate-500 p-2 bg-black/20 rounded border border-slate-700/50">Return value in <strong className="text-white">RAX</strong>. Caller cleans stack.</div>
        </div>

        <div className="bg-gradient-to-br from-[#111928] to-[#1a2333] p-6 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <h4 className="text-lg font-bold text-white mb-4 flex justify-between items-center">
            x64 Windows
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">64-bit</span>
          </h4>
          <p className="text-sm text-slate-400 mb-4">First 4 integer/pointer arguments are passed in registers. Remaining on stack. Uses 32-byte shadow space on stack.</p>
          <div className="flex flex-wrap gap-2 mb-4 font-mono text-sm">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded">1: RCX</span>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded">2: RDX</span>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded">3: R8</span>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded">4: R9</span>
          </div>
          <div className="text-xs text-slate-500 p-2 bg-black/20 rounded border border-slate-700/50">Return value in <strong className="text-white">RAX</strong>. Caller cleans stack.</div>
        </div>
      </div>

      {/* 32-bit */}
      <div className="bg-[#111928] p-6 rounded-xl border border-[#1f2937] shadow-lg shadow-black/50 h-full">
        <h4 className="text-lg font-bold text-amber-400 mb-6 flex justify-between items-center">
          x86 Calling Conventions
          <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">32-bit</span>
        </h4>
        <div className="space-y-6">
          
          <div className="border-l-2 border-slate-700 pl-4">
            <h5 className="font-bold text-white mb-1 font-mono">cdecl <span className="text-xs text-slate-500 font-sans ml-2">(Default for C in x86)</span></h5>
            <p className="text-sm text-slate-400 mb-2">Arguments passed on the <strong>stack</strong> (Right to Left).</p>
            <div className="text-xs bg-slate-900/50 p-2 rounded text-slate-300"><strong className="text-red-400">Caller</strong> cleans the stack (e.g. <code className="text-emerald-400">ADD ESP, 8</code> after return).</div>
          </div>

          <div className="border-l-2 border-slate-700 pl-4">
            <h5 className="font-bold text-white mb-1 font-mono">stdcall <span className="text-xs text-slate-500 font-sans ml-2">(Win32 API standard)</span></h5>
            <p className="text-sm text-slate-400 mb-2">Arguments passed on the <strong>stack</strong> (Right to Left).</p>
            <div className="text-xs bg-slate-900/50 p-2 rounded text-slate-300"><strong className="text-blue-400">Callee</strong> cleans the stack (e.g. <code className="text-emerald-400">RET 8</code>).</div>
          </div>

          <div className="border-l-2 border-slate-700 pl-4">
            <h5 className="font-bold text-white mb-1 font-mono">fastcall</h5>
            <p className="text-sm text-slate-400 mb-2">First two arguments in <code className="bg-slate-800 px-1 rounded text-white">ECX</code> and <code className="bg-slate-800 px-1 rounded text-white">EDX</code>. Rest on stack.</p>
            <div className="text-xs bg-slate-900/50 p-2 rounded text-slate-300"><strong className="text-blue-400">Callee</strong> cleans the stack.</div>
          </div>

          <div className="border-l-2 border-slate-700 pl-4">
            <h5 className="font-bold text-white mb-1 font-mono">thiscall <span className="text-xs text-slate-500 font-sans ml-2">(C++ Methods)</span></h5>
            <p className="text-sm text-slate-400 mb-2">The <code className="bg-slate-800 px-1 rounded text-pink-400">this</code> pointer is passed in <code className="bg-slate-800 px-1 rounded text-white">ECX</code>. Rest on stack.</p>
            <div className="text-xs bg-slate-900/50 p-2 rounded text-slate-300"><strong className="text-blue-400">Callee</strong> cleans the stack.</div>
          </div>

        </div>
      </div>

    </div>
  </div>
);

const FileSignatures = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h3 className="text-2xl font-bold text-white mb-6 border-b border-[#1f2937] pb-2 flex items-center gap-3">
      <FileBadge className="text-pink-400" /> File Format Signatures
    </h3>
    
    <div className="bg-[#111928] border border-[#1f2937] rounded-xl overflow-hidden shadow-lg shadow-black/50">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#1a2333] text-slate-400 text-xs uppercase tracking-widest border-b border-[#1f2937]">
            <th className="p-4 font-bold">Format / Description</th>
            <th className="p-4 font-bold">Magic Bytes (Hex)</th>
            <th className="p-4 font-bold">ASCII</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-[#1f2937]/50 hover:bg-[#1a2333]/50 transition-colors">
            <td className="p-4">
              <div className="font-bold text-white mb-1">Windows PE Executable</div>
              <div className="text-xs text-slate-500">.exe, .dll, .sys</div>
            </td>
            <td className="p-4 font-mono text-pink-400">4D 5A</td>
            <td className="p-4 font-mono text-slate-300">MZ</td>
          </tr>
          <tr className="border-b border-[#1f2937]/50 hover:bg-[#1a2333]/50 transition-colors">
            <td className="p-4">
              <div className="font-bold text-white mb-1">Linux ELF Executable</div>
              <div className="text-xs text-slate-500">ELF binaries, .so</div>
            </td>
            <td className="p-4 font-mono text-pink-400">7F 45 4C 46</td>
            <td className="p-4 font-mono text-slate-300">.ELF</td>
          </tr>
          <tr className="border-b border-[#1f2937]/50 hover:bg-[#1a2333]/50 transition-colors">
            <td className="p-4">
              <div className="font-bold text-white mb-1">ZIP Archive</div>
              <div className="text-xs text-slate-500">Also Office docs (.docx, .xlsx), APKs</div>
            </td>
            <td className="p-4 font-mono text-pink-400">50 4B 03 04</td>
            <td className="p-4 font-mono text-slate-300">PK..</td>
          </tr>
          <tr className="border-b border-[#1f2937]/50 hover:bg-[#1a2333]/50 transition-colors">
            <td className="p-4">
              <div className="font-bold text-white mb-1">PDF Document</div>
              <div className="text-xs text-slate-500">Portable Document Format</div>
            </td>
            <td className="p-4 font-mono text-pink-400">25 50 44 46 2D</td>
            <td className="p-4 font-mono text-slate-300">%PDF-</td>
          </tr>
          <tr className="border-b border-[#1f2937]/50 hover:bg-[#1a2333]/50 transition-colors">
            <td className="p-4">
              <div className="font-bold text-white mb-1">GZIP Archive</div>
              <div className="text-xs text-slate-500">.gz, .tar.gz</div>
            </td>
            <td className="p-4 font-mono text-pink-400">1F 8B</td>
            <td className="p-4 font-mono text-slate-300">..</td>
          </tr>
          <tr className="hover:bg-[#1a2333]/50 transition-colors">
            <td className="p-4">
              <div className="font-bold text-white mb-1">Java Class File</div>
              <div className="text-xs text-slate-500">Compiled Java bytecode</div>
            </td>
            <td className="p-4 font-mono text-pink-400">CA FE BA BE</td>
            <td className="p-4 font-mono text-slate-300">....</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ControlFlowPatterns = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h3 className="text-2xl font-bold text-white mb-6 border-b border-[#1f2937] pb-2 flex items-center gap-3">
      <GitBranch className="text-cyan-400" /> Control Flow Patterns
    </h3>
    
    <p className="text-slate-400 leading-relaxed max-w-4xl">
      Identifying high-level constructs from raw assembly is pattern matching. Compilers generate very recognizable shapes for standard C statements.
    </p>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
      
      {/* If-Else */}
      <div className="bg-[#111928] border border-[#1f2937] rounded-xl overflow-hidden shadow-lg shadow-black/50 flex flex-col">
        <div className="bg-[#1a2333] px-6 py-3 border-b border-[#1f2937]">
          <h4 className="font-bold text-white">If-Else Statement</h4>
        </div>
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 font-mono text-sm">
            <div className="text-blue-400">CMP eax, 0</div>
            <div className="text-emerald-400">JZ else_block  <span className="text-slate-500">; Jump if false</span></div>
            <div className="text-slate-300 mt-2">... (if block code) ...</div>
            <div className="text-purple-400">JMP end        <span className="text-slate-500">; Skip else</span></div>
            <div className="text-emerald-300 mt-2">else_block:</div>
            <div className="text-slate-300">... (else block code) ...</div>
            <div className="text-purple-300 mt-2">end:</div>
          </div>
          <p className="text-sm text-slate-400 mt-auto">The conditional jump skips the "if" block and goes to the "else" block. At the end of the "if" block, there is an unconditional jump to skip the "else" block.</p>
        </div>
      </div>

      {/* For Loop */}
      <div className="bg-[#111928] border border-[#1f2937] rounded-xl overflow-hidden shadow-lg shadow-black/50 flex flex-col">
        <div className="bg-[#1a2333] px-6 py-3 border-b border-[#1f2937]">
          <h4 className="font-bold text-white">For / While Loop</h4>
        </div>
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 font-mono text-sm">
            <div className="text-blue-400">MOV ecx, 0     <span className="text-slate-500">; init counter</span></div>
            <div className="text-emerald-300 mt-2">loop_start:</div>
            <div className="text-blue-400">CMP ecx, 10    <span className="text-slate-500">; condition</span></div>
            <div className="text-emerald-400">JGE loop_end   <span className="text-slate-500">; exit if done</span></div>
            <div className="text-slate-300 mt-2">... (loop body) ...</div>
            <div className="text-purple-400 mt-2">INC ecx        <span className="text-slate-500">; increment</span></div>
            <div className="text-emerald-400">JMP loop_start <span className="text-slate-500">; repeat</span></div>
            <div className="text-purple-300 mt-2">loop_end:</div>
          </div>
          <p className="text-sm text-slate-400 mt-auto">Loops usually feature an initialization before the label, a condition check that jumps OUT of the loop, the loop body, an increment/decrement, and a jump back to the start.</p>
        </div>
      </div>

    </div>
  </div>
);


export default function CheatSheet() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: "Architecture & Registers", icon: Cpu, component: ArchitectureMaps, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500" },
    { name: "Assembly Behavior", icon: TerminalSquare, component: AssemblyBehavior, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500" },
    { name: "Calling Conventions", icon: ArrowRightLeft, component: CallingConventions, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500" },
    { name: "File Signatures", icon: FileBadge, component: FileSignatures, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500" },
    { name: "Control Flow Patterns", icon: GitBranch, component: ControlFlowPatterns, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500" },
    { name: "Opcode Dictionary", icon: BookText, component: Dictionary, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500" },
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="flex flex-col md:flex-row h-full max-w-full -m-8">
      
      {/* Internal Dashboard Sidebar */}
      <div className="w-full md:w-72 bg-[#0b101e]/80 border-r border-[#1f2937] p-6 flex flex-col gap-2 overflow-y-auto z-10 custom-scrollbar shrink-0 shadow-xl shadow-black/20">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
          Cheat Sheet
        </h2>
        
        <div className="flex flex-col gap-2">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-3 w-full text-left px-4 py-4 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? `${tab.bg} border ${tab.border} shadow-lg shadow-black/20` 
                    : `bg-[#111928] border border-[#1f2937] hover:bg-[#1a2333] hover:border-slate-600`
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-black/20' : 'bg-[#0b101e] border border-[#1f2937]'}`}>
                  <Icon size={18} className={isActive ? tab.color : 'text-slate-400'} />
                </div>
                <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {tab.name}
                </span>
              </button>
            )
          })}
        </div>
        
        <div className="mt-auto pt-8">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <Hash className="text-slate-500 mb-2" size={20} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Use this quick reference while analyzing binaries in the Scanner or translating C code in the Tutor.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#0b101e] p-8 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="w-full 2xl:max-w-screen-2xl mx-auto">
          <ActiveComponent />
        </div>
      </div>

    </div>
  );
}
