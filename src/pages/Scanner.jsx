import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, FileCode2, Hash, Code, BookTemplate, Layers } from 'lucide-react';

const categorizeImport = (imp) => {
  const lower = imp.toLowerCase();
  if (lower.includes('internet') || lower.includes('socket') || lower.includes('wininet') || lower.includes('ws2') || lower.includes('bind')) return { cat: 'Networking', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
  if (lower.includes('crypt') || lower.includes('bcrypt') || lower.includes('ssl') || lower.includes('tls')) return { cat: 'Cryptography', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
  if (lower.includes('virtualalloc') || lower.includes('writeprocess') || lower.includes('createremotethread') || lower.includes('ptrace')) return { cat: 'Process Injection', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  if (lower.includes('createfile') || lower.includes('writefile') || lower.includes('deletefile') || lower.includes('fopen')) return { cat: 'File I/O', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
  return { cat: 'Standard', color: 'text-slate-400', bg: 'bg-slate-700/50', border: 'border-slate-600' };
};

export default function Scanner() {
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [expectedHash, setExpectedHash] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (window.RevBench_parseBinary) {
      setIsWasmLoaded(true);
      return;
    }

    const loadWasm = async () => {
      try {
        const go = new window.Go();
        const response = await fetch('/wasm/scanner.wasm');
        const buffer = await response.arrayBuffer();
        const result = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(result.instance);
        setIsWasmLoaded(true);
      } catch (err) {
        console.error("Failed to load Wasm", err);
        setError("Failed to load WebAssembly engine.");
      }
    };
    
    const timer = setTimeout(() => {
      if (window.Go) {
        loadWasm();
      } else {
        setError("wasm_exec.js not found on window object");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    setError(null);
    setResult(null);
    setExpectedHash('');

    if (!isWasmLoaded) {
      setError("WebAssembly engine is not ready yet.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      
      const jsonResult = window.RevBench_parseBinary(uint8Array);
      const parsed = JSON.parse(jsonResult);
      
      if (parsed.error) {
        setError(parsed.error);
      } else {
        setResult(parsed);
      }
    } catch (err) {
      setError("Error processing file: " + err.message);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [isWasmLoaded]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Static Binary Analyzer</h2>
        <p className="text-slate-400">Securely parse binary files in your browser using Go WebAssembly. No files are uploaded to any server.</p>
      </div>
      
      {/* Drag & Drop Zone */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-sm p-12 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[250px] mb-8
          ${isDragging ? 'border-[#00d4ff] bg-[#00d4ff]/10' : 'border-[#1f2937] bg-[#111928] hover:border-[#374151]'}`}
      >
        <div className={`p-4 mb-4 transition-colors ${isDragging ? 'text-[#00d4ff]' : 'text-gray-500'}`}>
          <Upload size={48} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {isDragging ? 'Drop binary here' : 'Click or drag & drop a binary file'}
        </h3>
        <p className="text-slate-400">
          Supports ELF and PE files
        </p>
        {!isWasmLoaded && !error && (
          <div className="mt-6 inline-flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-full text-sm font-medium border border-yellow-500/20">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></span>
            Loading Wasm Engine...
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Results Dashboard */}
      {result && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          
          {/* File Info */}
          <div className="bg-[#111928] border border-[#1f2937] border-t-2 border-t-[#00d4ff] shadow-xl shadow-black/40 p-6 rounded-sm lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileCode2 className="text-blue-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">File Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">Format</span>
                <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-md border border-slate-700">{result.info.format}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">Architecture</span>
                <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-md border border-slate-700">{result.info.arch}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">Size</span>
                <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-md border border-slate-700">{(result.info.size / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">Language</span>
                <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-md border border-slate-700">{result.info.language}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">Time</span>
                <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-md border border-slate-700">{result.info.time}</span>
              </div>
            </div>
          </div>

          {/* Compilation Traits */}
          <div className="bg-[#111928] border border-[#1f2937] border-t-2 border-t-[#00d4ff] shadow-xl shadow-black/40 p-6 rounded-sm lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FileCode2 className="text-amber-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Compilation Traits</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium tracking-wider">{result.info.linking}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {result.info.linking === "Statically Linked" 
                    ? "The binary includes all of its dependencies within itself. It is larger but doesn't require external libraries to run."
                    : result.info.linking === "Dynamically Linked" 
                      ? "The binary relies on external shared libraries on the host system to run. This makes it smaller but requires the system to provide dependencies."
                      : "Linking information could not be determined."}
                </p>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium tracking-wider">{result.info.stripped}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {result.info.stripped === "Stripped" 
                    ? "The symbol table has been removed. This makes reverse engineering significantly harder as function and variable names are missing."
                    : result.info.stripped === "Not Stripped" 
                      ? "The symbol table is present. This is a goldmine for reverse engineers, as original function names and variables are intact."
                      : "Stripping information could not be determined."}
                </p>
              </div>
            </div>
          </div>

          {/* Hashes */}
          <div className="bg-[#111928] border border-[#1f2937] border-t-2 border-t-[#00d4ff] shadow-xl shadow-black/40 p-6 rounded-sm lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Hash className="text-emerald-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Hashes</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(result.hashes).map(([alg, hash]) => (
                <div key={alg} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                  <div className="text-slate-500 font-bold uppercase text-xs mb-2 tracking-widest">{alg}</div>
                  <div className="text-emerald-400 font-mono text-sm break-all select-all leading-relaxed">{hash}</div>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-[#1f2937]">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Compare Hash (Optional)</label>
                <input 
                  type="text" 
                  value={expectedHash}
                  onChange={(e) => setExpectedHash(e.target.value)}
                  placeholder="Paste expected SHA256..."
                  className="w-full bg-[#0b101e] border border-[#1f2937] rounded-sm p-2 text-[#00d4ff] font-mono text-sm focus:outline-none focus:border-[#00d4ff] placeholder-gray-600"
                />
                {expectedHash && (
                  <div className={`mt-3 p-2 rounded-sm text-xs font-bold text-center ${expectedHash.trim().toLowerCase() === result.hashes.sha256.toLowerCase() ? 'bg-emerald-900/30 text-[#00d4ff] border border-[#00d4ff]' : 'bg-red-900/30 text-red-400 border border-red-500/50'}`}>
                    {expectedHash.trim().toLowerCase() === result.hashes.sha256.toLowerCase() ? '✓ HASH MATCH' : '✗ HASH MISMATCH'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Imports Table */}
          <div className="md:col-span-2 lg:col-span-3 bg-[#111928] border border-[#1f2937] border-t-2 border-t-[#00d4ff] shadow-xl shadow-black/40 p-6 rounded-sm flex flex-col h-80">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <BookTemplate className="text-orange-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Import Address Table (IAT)</h3>
              </div>
              <div className="text-sm font-medium text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                {result.imports?.length || 0} imports found
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 rounded-lg border border-slate-800 bg-slate-900/30">
              {result.imports && result.imports.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
                  {result.imports.map((imp, idx) => {
                    const catInfo = categorizeImport(imp);
                    return (
                      <li key={idx} className={`p-2 rounded border font-mono text-xs flex justify-between items-center transition-colors ${catInfo.bg} ${catInfo.border} hover:bg-slate-700`}>
                        <span className="text-slate-200 truncate mr-2" title={imp}>{imp}</span>
                        {catInfo.cat !== 'Standard' && (
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${catInfo.color} bg-black/30 whitespace-nowrap`}>
                            {catInfo.cat}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 italic">
                  <p>No imports detected.</p>
                  <p className="text-sm mt-2">Statically linked binaries or obfuscated files often hide their IAT.</p>
                </div>
              )}
            </div>
          </div>

          {/* Embedded Signatures (Binwalk) */}
          <div className="md:col-span-2 lg:col-span-3 bg-[#111928] border border-[#1f2937] border-t-2 border-t-[#00d4ff] shadow-xl shadow-black/40 p-6 rounded-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Layers className="text-pink-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Embedded Signatures (Binwalk-lite)</h3>
            </div>
            {result.embedded_files && result.embedded_files.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.embedded_files.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 hover:border-pink-500/50 transition-colors">
                    <span className="text-pink-400 font-semibold text-sm">{file.type}</span>
                    <span className="text-slate-400 font-mono text-xs bg-black/40 px-2 py-1 rounded">Offset: 0x{file.offset.toString(16).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 italic bg-slate-900/30 rounded-lg border border-slate-800/50">
                No embedded files or known signatures detected.
              </div>
            )}
          </div>

          {/* Internal Symbols */}
          <div className="md:col-span-2 lg:col-span-3 bg-[#111928] border border-[#1f2937] border-t-2 border-t-[#00d4ff] shadow-xl shadow-black/40 p-6 rounded-sm flex flex-col h-80">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <BookTemplate className="text-yellow-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Internal Symbols (.symtab)</h3>
              </div>
              <div className="text-sm font-medium text-yellow-300 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                {result.symbols?.length || 0} symbols found
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 rounded-lg border border-slate-800 bg-slate-900/30">
              {result.symbols && result.symbols.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-3">
                  {result.symbols.map((sym, idx) => (
                    <li key={idx} className="p-2 rounded border border-slate-700/50 font-mono text-xs text-slate-300 bg-slate-800/30 hover:bg-slate-700 transition-colors truncate" title={sym}>
                      {sym}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 italic">
                  <p>No internal symbols detected.</p>
                  <p className="text-sm mt-2">This binary has been stripped of its internal symbol table.</p>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Strings Table */}
          <div className="md:col-span-2 lg:col-span-3 bg-[#111928] border border-[#1f2937] border-t-2 border-t-[#00d4ff] shadow-xl shadow-black/40 p-6 rounded-sm flex flex-col h-96">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Code className="text-purple-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Extracted Strings</h3>
              </div>
              <div className="text-sm font-medium text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                {result.strings.length} strings found
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 rounded-lg border border-slate-800 bg-slate-900/30">
              {result.strings.length > 0 ? (
                <ul className="divide-y divide-slate-800/80">
                  {result.strings.map((str, idx) => (
                    <li key={idx} className="p-3 font-mono text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors break-all">
                      {str}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic">
                  No printable strings extracted.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
