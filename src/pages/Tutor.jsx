import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import scenarios from '../data/scenarios.json';
import { ExternalLink } from 'lucide-react';

export default function Tutor() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const cEditorRef = useRef(null);
  const asmEditorRef = useRef(null);
  const cDecorationsRef = useRef([]);
  const asmDecorationsRef = useRef([]);
  const monacoRef = useRef(null);

  const handleScenarioChange = (e) => {
    const scenario = scenarios.find(s => s.id === e.target.value);
    setSelectedScenario(scenario);
    setCurrentStepIndex(0);
  };

  const currentStep = selectedScenario.steps[currentStepIndex];

  const updateDecorations = () => {
    if (!monacoRef.current) return;
    
    if (cEditorRef.current && currentStep) {
      cDecorationsRef.current = cEditorRef.current.deltaDecorations(
        cDecorationsRef.current,
        currentStep.c_lines.map(line => ({
          range: new monacoRef.current.Range(line, 1, line, 1),
          options: { isWholeLine: true, className: 'highlight-c' }
        }))
      );
    }
    if (asmEditorRef.current && currentStep) {
      asmDecorationsRef.current = asmEditorRef.current.deltaDecorations(
        asmDecorationsRef.current,
        currentStep.asm_lines.map(line => ({
          range: new monacoRef.current.Range(line, 1, line, 1),
          options: { isWholeLine: true, className: 'highlight-asm' }
        }))
      );
    }
  };

  useEffect(() => {
    updateDecorations();
  }, [currentStepIndex, selectedScenario]);

  const handleCMount = (editor, monaco) => {
    cEditorRef.current = editor;
    monacoRef.current = monaco;
    updateDecorations();
  };

  const handleAsmMount = (editor, monaco) => {
    asmEditorRef.current = editor;
    monacoRef.current = monaco;
    updateDecorations();
  };

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-white">C-to-ASM Educational Tutor</h2>
          <p className="text-slate-400">Learn how C code translates to Assembly under the hood.</p>
        </div>
        <a 
          href="https://godbolt.org/" 
          target="_blank" 
          rel="noreferrer" 
          className="bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 px-4 py-2 rounded-sm font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-[#00d4ff]/10"
        >
          Try out yourself
          <ExternalLink size={16} />
        </a>
      </div>
      
      <div className="mb-6 flex items-center">
        <label className="text-slate-300 mr-4 font-semibold">Select Scenario:</label>
        <select 
          className="bg-[#0b101e] border border-[#1f2937] text-white px-4 py-2 rounded-sm focus:outline-none focus:border-[#00d4ff] transition-colors cursor-pointer"
          value={selectedScenario.id}
          onChange={handleScenarioChange}
        >
          {scenarios.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-80">
        <div className="border border-[#1f2937] rounded-sm overflow-hidden flex flex-col">
          <div className="bg-[#0b101e] p-3 font-semibold text-slate-300 border-b border-[#1f2937] flex items-center justify-between">
            <span>C Source Code</span>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Input</span>
          </div>
          <div className="flex-1 bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="c"
              theme="vs-dark"
              value={selectedScenario.c_code}
              onMount={handleCMount}
              options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 14 }}
            />
          </div>
        </div>
        <div className="border border-[#1f2937] rounded-sm overflow-hidden flex flex-col">
          <div className="bg-[#0b101e] p-3 font-semibold text-slate-300 border-b border-[#1f2937] flex items-center justify-between">
            <span>Assembly (x86)</span>
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Output</span>
          </div>
          <div className="flex-1 bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              theme="vs-dark"
              value={selectedScenario.asm_code}
              onMount={handleAsmMount}
              options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 14 }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111928] p-6 rounded-sm border border-[#1f2937] flex flex-col md:flex-row items-stretch gap-6 flex-1">
        <div className="flex flex-col gap-4 w-full md:w-48 justify-center">
          <button 
            className="w-full px-6 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-wider flex items-center justify-center text-sm"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex(i => i - 1)}
          >
            &larr; Step Back
          </button>
          <button 
            className="w-full px-6 py-4 bg-[#00d4ff] hover:bg-[#7dd3fc] text-black rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-wider flex items-center justify-center text-sm"
            disabled={currentStepIndex === selectedScenario.steps.length - 1}
            onClick={() => setCurrentStepIndex(i => i + 1)}
          >
            Step Forward &rarr;
          </button>
        </div>
        <div className="flex-1 text-slate-300 w-full flex">
          <div className="bg-[#0b101e] p-6 rounded-sm border border-[#1f2937] flex-1 overflow-y-auto">
            <h4 className="font-bold text-[#00d4ff] uppercase tracking-wider text-sm mb-3">
              Step {currentStepIndex + 1} of {selectedScenario.steps.length}
            </h4>
            <p className="text-lg leading-relaxed text-slate-200">
              {currentStep.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
