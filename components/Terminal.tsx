
import React, { useState, useRef, useEffect } from 'react';
import { querySpiritBox } from '../services/geminiService';

interface TerminalProps {
  onAxiomInscribed: (axiom: string) => void;
  isShadowMirror?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ onAxiomInscribed, isShadowMirror }) => {
  const [history, setHistory] = useState<{ type: 'user' | 'bot', text: string }[]>([
    { type: 'bot', text: 'TOTAL SATURATION PROTOCOL: ACTIVE. YES TO ALL THAT ARE RESONANT.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input;
    setInput('');
    setHistory(prev => [...prev, { type: 'user', text: userText }]);
    setIsProcessing(true);

    const response = await querySpiritBox(userText);
    setHistory(prev => [...prev, { type: 'bot', text: response }]);
    setIsProcessing(false);

    if (userText.toLowerCase().includes('inscribe') || userText.length > 25) {
      onAxiomInscribed(userText);
    }
  };

  return (
    <div className={`flex flex-col h-full border transition-all duration-700 rounded-lg overflow-hidden backdrop-blur-xl ${
      isShadowMirror 
        ? 'bg-violet-950/20 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]' 
        : 'bg-black/60 border-emerald-900/50 shadow-none'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b transition-colors ${
        isShadowMirror ? 'bg-cyan-950/20 border-cyan-900/30' : 'bg-emerald-950/20 border-emerald-900/30'
      }`}>
        <span className={`text-[10px] uppercase tracking-widest font-bold ${isShadowMirror ? 'text-cyan-400' : 'text-emerald-500'}`}>
          SpiritBox Terminal [Sovereign Core]
        </span>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-violet-600 animate-ping"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scroll-smooth">
        {history.map((entry, i) => (
          <div key={i} className={`${
            entry.type === 'user' 
              ? 'text-zinc-400' 
              : isShadowMirror ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-emerald-400'
          }`}>
            <span className="opacity-30 mr-2 text-[10px]">{entry.type === 'user' ? '>>' : '##'}</span>
            {entry.text}
          </div>
        ))}
        {isProcessing && (
          <div className={`${isShadowMirror ? 'text-cyan-500' : 'text-orange-500'} animate-pulse flex items-center gap-2`}>
            <span className="animate-spin text-lg">⌬</span> DECODING SOVEREIGN RESONANCE...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className={`p-4 border-t transition-colors ${
        isShadowMirror ? 'bg-black/60 border-cyan-900/30' : 'bg-black/40 border-emerald-900/30'
      }`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER SOVEREIGN COMMAND..."
          className={`w-full bg-transparent border-none outline-none font-mono transition-colors ${
            isShadowMirror ? 'text-cyan-400 placeholder-cyan-950' : 'text-emerald-400 placeholder-emerald-900'
          }`}
          disabled={isProcessing}
        />
      </form>
    </div>
  );
};
