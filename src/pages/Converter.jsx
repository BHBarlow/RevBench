export default function Converter() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Quick Converter</h2>
      <p className="text-slate-400 mb-8">Convert between Hex, Binary, and ASCII in real-time.</p>
      
      <div className="space-y-6 max-w-2xl">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-300 mb-2">Hexadecimal</label>
          <textarea className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-green-400 font-mono h-24 focus:outline-none focus:border-blue-500" placeholder="41 42 43..."></textarea>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-300 mb-2">Binary</label>
          <textarea className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-green-400 font-mono h-24 focus:outline-none focus:border-blue-500" placeholder="01000001 01000010..."></textarea>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-300 mb-2">ASCII</label>
          <textarea className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-green-400 font-mono h-24 focus:outline-none focus:border-blue-500" placeholder="ABC..."></textarea>
        </div>
      </div>
    </div>
  );
}
