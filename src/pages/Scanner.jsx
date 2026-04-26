export default function Scanner() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Pre-Reversing Triage Scanner</h2>
      <p className="text-slate-400 mb-8">Drop a binary file to parse its headers and extract strings via Go WebAssembly.</p>
      
      <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-800/50">
        <p className="text-xl text-slate-300 mb-2">Drag and drop a binary here</p>
        <p className="text-sm text-slate-500">Supports ELF and PE files (WASM integration pending)</p>
      </div>
    </div>
  );
}
