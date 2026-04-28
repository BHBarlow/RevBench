import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

export default function Converter() {
  const [hex, setHex] = useState('');
  const [bin, setBin] = useState('');
  const [ascii, setAscii] = useState('');
  const [base64, setBase64] = useState('');
  const [url, setUrl] = useState('');
  const [shellcode, setShellcode] = useState('');
  const [expandedField, setExpandedField] = useState(null);

  const bytesToBase64 = (bytes) => {
    try {
      return btoa(String.fromCharCode.apply(null, bytes));
    } catch (err) {
      return '';
    }
  };

  const updateAllFromBytes = (bytes) => {
    setHex(bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' '));
    setBin(bytes.map(b => b.toString(2).padStart(8, '0')).join(' '));
    setAscii(bytes.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join(''));
    setBase64(bytesToBase64(bytes));
    
    // URL Encode
    try {
      setUrl(encodeURIComponent(String.fromCharCode.apply(null, bytes)));
    } catch (e) { setUrl(''); }

    // Shellcode
    setShellcode(bytes.map(b => '\\x' + b.toString(16).padStart(2, '0').toLowerCase()).join(''));
  };

  const handleHexChange = (e) => {
    const value = e.target.value;
    setHex(value);
    try {
      const cleanHex = value.replace(/[^0-9a-fA-F]/g, '');
      let bytes = [];
      for (let i = 0; i < cleanHex.length; i += 2) {
        if (i + 1 < cleanHex.length) {
          bytes.push(parseInt(cleanHex.substring(i, i + 2), 16));
        }
      }
      updateAllFromBytes(bytes);
      setHex(value); // Keep user's format in current box
    } catch (err) {}
  };

  const handleBinChange = (e) => {
    const value = e.target.value;
    setBin(value);
    try {
      const cleanBin = value.replace(/[^01]/g, '');
      let bytes = [];
      for (let i = 0; i < cleanBin.length; i += 8) {
        if (i + 8 <= cleanBin.length) {
          bytes.push(parseInt(cleanBin.substring(i, i + 8), 2));
        }
      }
      updateAllFromBytes(bytes);
      setBin(value);
    } catch (err) {}
  };

  const handleAsciiChange = (e) => {
    const value = e.target.value;
    setAscii(value);
    try {
      let bytes = [];
      for (let i = 0; i < value.length; i++) {
        bytes.push(value.charCodeAt(i));
      }
      updateAllFromBytes(bytes);
      setAscii(value);
    } catch (err) {}
  };

  const handleBase64Change = (e) => {
    const value = e.target.value;
    setBase64(value);
    try {
      const cleanB64 = value.replace(/\s/g, '');
      const binaryString = atob(cleanB64);
      let bytes = [];
      for (let i = 0; i < binaryString.length; i++) {
        bytes.push(binaryString.charCodeAt(i));
      }
      updateAllFromBytes(bytes);
      setBase64(value);
    } catch (err) {}
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    try {
      const decoded = decodeURIComponent(value);
      let bytes = [];
      for (let i = 0; i < decoded.length; i++) {
        bytes.push(decoded.charCodeAt(i));
      }
      updateAllFromBytes(bytes);
      setUrl(value);
    } catch (err) {}
  };

  const handleShellcodeChange = (e) => {
    const value = e.target.value;
    setShellcode(value);
    try {
      const cleanHex = value.replace(/\\x/g, '').replace(/[^0-9a-fA-F]/g, '');
      let bytes = [];
      for (let i = 0; i < cleanHex.length; i += 2) {
        if (i + 1 < cleanHex.length) {
          bytes.push(parseInt(cleanHex.substring(i, i + 2), 16));
        }
      }
      updateAllFromBytes(bytes);
      setShellcode(value);
    } catch (err) {}
  };

  const fields = [
    { id: 'hex', label: 'Hexadecimal', tag: 'Base-16', value: hex, onChange: handleHexChange, placeholder: '41 42 43...' },
    { id: 'bin', label: 'Binary', tag: 'Base-2', value: bin, onChange: handleBinChange, placeholder: '01000001 01000010...' },
    { id: 'ascii', label: 'ASCII String', tag: 'Text', value: ascii, onChange: handleAsciiChange, placeholder: 'ABC...' },
    { id: 'base64', label: 'Base64', tag: 'RFC 4648', value: base64, onChange: handleBase64Change, placeholder: 'QUJD...' },
    { id: 'url', label: 'URL Encode', tag: 'Percent', value: url, onChange: handleUrlChange, placeholder: '%41%42%43...' },
    { id: 'shellcode', label: 'Shellcode', tag: 'C Array', value: shellcode, onChange: handleShellcodeChange, placeholder: '\\x41\\x42\\x43...' },
  ];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Quick Converter</h2>
        <p className="text-slate-400">Instantly translate payloads between 6 common formats in real-time. No server calls.</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
        {fields.map((field) => (
          <div key={field.id} className="bg-[#111928] p-5 rounded-sm border border-[#1f2937] focus-within:border-[#00d4ff] transition-all duration-200 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-3 text-sm font-bold tracking-wider text-gray-300 uppercase">
                <span>{field.label}</span>
                <span className="text-xs bg-[#0b101e] px-2 py-0.5 rounded text-gray-500 font-medium">{field.tag}</span>
              </label>
              <button 
                onClick={() => setExpandedField(field.id)} 
                className="text-gray-500 hover:text-[#00d4ff] transition-colors p-1"
                title="Expand"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <textarea 
              value={field.value}
              onChange={field.onChange}
              className="w-full bg-[#0b101e] border border-[#1f2937] rounded-sm p-4 text-[#00d4ff] font-mono flex-1 focus:outline-none focus:border-[#00d4ff] custom-scrollbar resize-none min-h-[8rem]" 
              placeholder={field.placeholder}
              spellCheck={false}
            ></textarea>
          </div>
        ))}
      </div>

      {/* Expanded Modal */}
      {expandedField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111928] border border-[#1f2937] rounded-lg w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#1f2937] bg-[#0b101e] rounded-t-lg">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                  {fields.find(f => f.id === expandedField)?.label}
                </h3>
                <span className="text-sm bg-[#111928] border border-[#1f2937] px-3 py-1 rounded text-gray-400 font-medium">
                  Expanded View
                </span>
              </div>
              <button 
                onClick={() => setExpandedField(null)} 
                className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2937] rounded-md transition-all"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-6 bg-[#0b101e] rounded-b-lg">
              <textarea
                value={fields.find(f => f.id === expandedField)?.value}
                onChange={fields.find(f => f.id === expandedField)?.onChange}
                className="w-full h-full bg-[#111928] border border-[#1f2937] rounded-md p-6 text-[#00d4ff] font-mono text-lg focus:outline-none focus:border-[#00d4ff] custom-scrollbar resize-none shadow-inner"
                placeholder={fields.find(f => f.id === expandedField)?.placeholder}
                spellCheck={false}
                autoFocus
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
