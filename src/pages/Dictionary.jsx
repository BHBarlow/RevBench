import { useState, useMemo } from 'react';
import { Search, Hash, Cpu, ArrowRightLeft, Target } from 'lucide-react';
import instructionsData from '../data/instructions.json';

function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(instructionsData.map(inst => inst.category))];

  // Filter instructions based on search and category
  const filteredInstructions = useMemo(() => {
    return instructionsData.filter((inst) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        inst.mnemonic.toLowerCase().includes(searchLower) ||
        inst.description.toLowerCase().includes(searchLower) ||
        (inst.nicheCases && inst.nicheCases.some(nc => nc.toLowerCase().includes(searchLower)));
      
      const matchesCategory = selectedCategory === 'All' || inst.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Data Transfer': return <ArrowRightLeft size={16} className="text-blue-400" />;
      case 'Arithmetic': return <Hash size={16} className="text-green-400" />;
      case 'Control Flow': return <Target size={16} className="text-purple-400" />;
      case 'Stack': return <Cpu size={16} className="text-orange-400" />;
      default: return <Cpu size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
          Opcode Dictionary
        </h1>
        <p className="text-gray-400">Search and explore common x86-64 assembly instructions.</p>
      </div>

      <div className="bg-[#0b101e] border border-[#1f2937] rounded-xl p-6 shadow-xl mb-6 shadow-black/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search mnemonics (e.g. MOV, JMP) or descriptions..."
              className="w-full bg-[#151e2d] border border-[#1f2937] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30'
                    : 'bg-[#151e2d] text-gray-400 border border-[#1f2937] hover:bg-[#1a2536]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        {filteredInstructions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-400">No instructions found.</p>
            <p>Try adjusting your search terms or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            {filteredInstructions.map((inst, index) => (
              <div 
                key={index}
                className="bg-[#151e2d] border border-[#1f2937] rounded-xl p-5 hover:border-[#00d4ff]/50 transition-colors flex flex-col h-full group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-black text-white font-mono group-hover:text-[#00d4ff] transition-colors">
                    {inst.mnemonic}
                  </h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b101e] border border-[#1f2937] text-xs font-medium text-gray-400">
                    {getCategoryIcon(inst.category)}
                    {inst.category}
                  </div>
                </div>

                <div className="mb-4 flex-1 space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {inst.description}
                  </p>
                  
                  {inst.nicheCases && inst.nicheCases.length > 0 && (
                    <div className="bg-[#0b101e]/50 border border-purple-500/20 rounded-lg p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-2">Niche Cases & Tricks</span>
                      <ul className="list-disc pl-4 space-y-1.5">
                        {inst.nicheCases.map((nc, idx) => (
                          <li key={idx} className="text-xs text-gray-400 leading-relaxed">{nc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inst.examples && inst.examples.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">Examples</span>
                      <div className="space-y-1.5">
                        {inst.examples.map((ex, idx) => (
                          <div key={idx} className="bg-[#0b101e] border border-[#1f2937] rounded px-3 py-2 overflow-x-auto custom-scrollbar">
                            <code className="text-emerald-400 text-xs font-mono whitespace-pre">{ex}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-3 pt-4 border-t border-[#1f2937]/50">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Syntax</span>
                    <div className="bg-[#0b101e] rounded px-3 py-2 border border-[#1f2937]">
                      <code className="text-[#00d4ff] text-sm font-mono">{inst.syntax}</code>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Flags Affected</span>
                    <div className="text-xs text-gray-400 font-mono">
                      {inst.flags}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dictionary;
