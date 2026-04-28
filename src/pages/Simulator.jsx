import { useState, useEffect } from 'react';
import { Cpu, Play, StepForward, RotateCcw, Database, LayoutList, ChevronRight } from 'lucide-react';
import programs from '../data/simulator_programs.json';

function Simulator() {
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0].id);
  const [currentStep, setCurrentStep] = useState(-1); // -1 means initial state

  const program = programs.find(p => p.id === selectedProgramId) || programs[0];
  
  const handleNext = () => {
    if (currentStep < program.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(-1);
  };

  const handleProgramChange = (e) => {
    setSelectedProgramId(e.target.value);
    setCurrentStep(-1);
  };

  const currentState = currentStep === -1 ? program.initial_state : program.steps[currentStep];
  const activeLine = currentStep === -1 ? null : program.steps[currentStep].line;
  const explanation = currentStep === -1 ? "Click 'Step Forward' to begin execution." : program.steps[currentStep].explanation;

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Cpu size={32} className="text-[#00d4ff]" />
            Live CPU Simulator
          </h1>
          <p className="text-gray-400">Step through execution to see exactly how registers and memory change.</p>
        </div>
        
        <div className="w-64">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Program</label>
          <select 
            value={selectedProgramId}
            onChange={handleProgramChange}
            className="w-full bg-[#151e2d] border border-[#1f2937] text-white text-sm rounded-lg focus:ring-[#00d4ff] focus:border-[#00d4ff] block p-2.5 outline-none"
          >
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Code */}
        <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#0b101e] border border-[#1f2937] rounded-xl overflow-hidden shadow-xl shadow-black/50">
          <div className="bg-[#151e2d] border-b border-[#1f2937] p-4 flex items-center gap-2">
            <LayoutList size={18} className="text-[#00d4ff]" />
            <h2 className="font-bold text-white tracking-wide">Instructions</h2>
          </div>
          <div className="p-4 flex-1 overflow-auto font-mono text-sm leading-8">
            {program.code.map((line, idx) => (
              <div 
                key={idx} 
                className={`flex items-center px-3 py-1 rounded transition-colors ${
                  activeLine === idx ? 'bg-gradient-to-r from-[#00d4ff]/20 to-transparent border-l-2 border-[#00d4ff] text-[#00d4ff] font-bold' : 'text-gray-400 border-l-2 border-transparent'
                }`}
              >
                <div className="w-8 text-right mr-4 text-gray-600 text-xs">{idx + 1}</div>
                {activeLine === idx && <ChevronRight size={14} className="mr-2" />}
                <div className={activeLine === idx ? '' : 'pl-5'}>{line}</div>
              </div>
            ))}
          </div>
          
          {/* Controls Panel */}
          <div className="bg-[#151e2d] border-t border-[#1f2937] p-5">
            <div className="bg-[#0b101e] border border-[#1f2937] rounded-lg p-4 mb-4 min-h-[100px] shadow-inner">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">Explanation</span>
              <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1f2937] hover:bg-[#2d3748] text-white rounded-lg font-medium transition-colors text-sm"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep >= program.steps.length - 1}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00d4ff]/80 to-[#0099ff]/80 hover:from-[#00d4ff] hover:to-[#0099ff] text-white rounded-lg font-bold transition-all shadow-lg shadow-[#00d4ff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Step Forward
                <StepForward size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Registers & Stack */}
        <div className="lg:col-span-7 flex flex-col min-h-0 gap-6">
          
          {/* Registers */}
          <div className="flex flex-col flex-1 bg-[#0b101e] border border-[#1f2937] rounded-xl overflow-hidden shadow-xl shadow-black/50">
            <div className="bg-[#151e2d] border-b border-[#1f2937] p-4 flex items-center gap-2">
              <Cpu size={18} className="text-green-400" />
              <h2 className="font-bold text-white tracking-wide">CPU State</h2>
            </div>
            
            <div className="p-6 overflow-auto">
              {/* General Purpose Registers */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['RAX', 'RBX', 'RCX', 'RDX'].map((reg) => (
                  <div key={reg} className="flex items-center justify-between bg-[#151e2d] border border-[#1f2937] rounded-lg px-4 py-2.5">
                    <span className="text-gray-400 font-bold text-xs">{reg}</span>
                    <span className="font-mono text-white text-sm">{currentState.registers[reg]}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Special Registers */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Pointers</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-[#151e2d] border border-[#1f2937] rounded-lg px-4 py-2.5 border-l-2 border-l-orange-400">
                      <span className="text-gray-400 font-bold text-xs">RSP</span>
                      <span className="font-mono text-orange-400 font-bold text-sm">{currentState.registers.RSP}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#151e2d] border border-[#1f2937] rounded-lg px-4 py-2.5 border-l-2 border-l-purple-400">
                      <span className="text-gray-400 font-bold text-xs">RBP</span>
                      <span className="font-mono text-purple-400 font-bold text-sm">{currentState.registers.RBP || "0x00008000"}</span>
                    </div>
                    {currentState.registers.RDI && (
                      <div className="flex items-center justify-between bg-[#151e2d] border border-[#1f2937] rounded-lg px-4 py-2.5 border-l-2 border-l-blue-400">
                        <span className="text-gray-400 font-bold text-xs">RDI</span>
                        <span className="font-mono text-blue-400 font-bold text-sm">{currentState.registers.RDI}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Flags */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Flags</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['ZF', 'SF', 'OF', 'CF'].map((flag) => (
                      <div key={flag} className={`flex flex-col items-center justify-center p-2 rounded border ${currentState.flags[flag] ? 'bg-green-400/10 border-green-400/30' : 'bg-[#151e2d] border-[#1f2937]'}`}>
                        <span className="text-[10px] text-gray-500 font-bold">{flag}</span>
                        <span className={`font-mono text-sm font-bold ${currentState.flags[flag] ? 'text-green-400' : 'text-gray-600'}`}>
                          {currentState.flags[flag]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stack Memory */}
          <div className="flex flex-col h-64 bg-[#0b101e] border border-[#1f2937] rounded-xl overflow-hidden shadow-xl shadow-black/50">
            <div className="bg-[#151e2d] border-b border-[#1f2937] p-4 flex items-center gap-2">
              <Database size={18} className="text-orange-400" />
              <h2 className="font-bold text-white tracking-wide">Stack Memory</h2>
            </div>
            
            <div className="p-4 flex-1 overflow-auto bg-[#0a0f18]">
              {currentState.stack.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                  <Database size={32} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium text-gray-500">Stack is empty</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Top of stack label */}
                  <div className="text-[10px] font-bold text-gray-500 mb-2 pl-24 flex items-center gap-2">
                    <ChevronRight size={12} className="rotate-90" /> Lower Addresses (Growth)
                  </div>
                  
                  {currentState.stack.map((item, idx) => {
                    const isRSP = item.address === currentState.registers.RSP;
                    const isRBP = item.address === currentState.registers.RBP;
                    const isPopped = item.value.includes("(Popped)") || item.value.includes("(Garbage)");
                    
                    return (
                      <div key={idx} className={`flex items-center text-sm font-mono group relative py-1 ${isRSP || isRBP ? 'bg-[#1a2536] rounded' : ''}`}>
                        <div className="w-24 text-right pr-4 text-gray-500 group-hover:text-gray-300 transition-colors text-xs">
                          {item.address}
                        </div>
                        <div className={`flex-1 bg-[#151e2d] border ${isRSP ? 'border-orange-400/80 shadow-[0_0_10px_rgba(251,146,60,0.2)]' : isRBP ? 'border-purple-400/80 shadow-[0_0_10px_rgba(192,132,252,0.2)]' : 'border-[#1f2937]'} rounded px-4 py-2 text-white flex justify-between items-center ${isPopped ? 'opacity-50 text-gray-500 line-through' : ''}`}>
                          <span className={isPopped ? 'text-gray-500' : ''}>{item.value.replace(' (Popped)', '').replace(' (Garbage)', '')}</span>
                          
                          <div className="flex gap-2">
                            {isRBP && <span className="text-[10px] bg-purple-400/20 text-purple-400 px-2 py-0.5 rounded font-bold tracking-widest uppercase flex items-center gap-1">&lt;- RBP</span>}
                            {isRSP && <span className="text-[10px] bg-orange-400/20 text-orange-400 px-2 py-0.5 rounded font-bold tracking-widest uppercase flex items-center gap-1">&lt;- RSP</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="text-[10px] font-bold text-gray-600 mt-2 pl-24 flex items-center gap-2">
                    <ChevronRight size={12} className="rotate-90" /> Higher Addresses (Stack Bottom)
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Simulator;
