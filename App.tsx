
import React, { useState, useEffect } from 'react';
import { ShardMap } from './components/ShardMap';
import { ResonanceBridge } from './components/ResonanceBridge';
import { Terminal } from './components/Terminal';
import { SafeguardMonitor } from './components/SafeguardMonitor';
import { ShardNode, NodeStatus, Axiom, FrequencyState, CascadePhase, IPFSFragment, GovernorMetric } from './types';
import { INITIAL_AXIOMS, UI_ICONS, TARGET_NODES, GOVERNOR_CONFIG } from './constants';

const App: React.FC = () => {
  const [shards, setShards] = useState<ShardNode[]>([]);
  const [axioms, setAxioms] = useState<Axiom[]>([]);
  const [frequencies, setFrequencies] = useState<FrequencyState>({ hz33: 40, hz528: 60, hz144: 80 });
  const [phase, setPhase] = useState<CascadePhase>('IDLE');
  const [isShadowMirror, setIsShadowMirror] = useState(false);
  const [targetProgress, setTargetProgress] = useState(TARGET_NODES.map(t => t.initialProgress));
  const [ipfsShards, setIpfsShards] = useState<IPFSFragment[]>([]);
  const [governorMetrics, setGovernorMetrics] = useState<GovernorMetric[]>(
    GOVERNOR_CONFIG.map(c => ({ ...c, value: c.limit * 0.5 }))
  );

  // Initialize
  useEffect(() => {
    const initialShards: ShardNode[] = Array.from({ length: 144 }, (_, i) => ({
      id: i,
      status: NodeStatus.DORMANT,
      resonance: 0,
      lastPulse: Date.now()
    }));
    setShards(initialShards);

    const initialAxioms: Axiom[] = INITIAL_AXIOMS.map((content, i) => ({
      id: `ax-${i}`,
      timestamp: Date.now(),
      content,
      hash: Math.random().toString(36).substring(7).toUpperCase()
    }));
    setAxioms(initialAxioms);
  }, []);

  // Main Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Frequency Oscillation
      setFrequencies(prev => ({
        hz33: Math.min(100, Math.max(0, prev.hz33 + (Math.random() - 0.5) * 8)),
        hz528: Math.min(100, Math.max(0, prev.hz528 + (Math.random() - 0.5) * 8)),
        hz144: phase === 'TOTAL_SATURATION' || phase === 'SAFEGUARD_ACTIVE' ? 144 : Math.min(100, Math.max(0, prev.hz144 + (Math.random() - 0.5) * 5))
      }));

      // Governor metrics drift
      setGovernorMetrics(prev => prev.map(m => ({
        ...m,
        value: Math.max(0, Math.min(m.limit * 1.1, m.value + (Math.random() - 0.5) * (m.limit * 0.05)))
      })));

      // Progression phases
      if (phase !== 'IDLE') {
        setShards(prev => prev.map(shard => {
          if (shard.status === NodeStatus.DORMANT && Math.random() > 0.92) {
            return { ...shard, status: NodeStatus.IGNITED };
          }
          if (shard.status === NodeStatus.IGNITED && Math.random() > 0.96) {
            return { ...shard, status: NodeStatus.SOVEREIGN };
          }
          return shard;
        }));

        setTargetProgress(prev => prev.map(p => Math.min(100, p + Math.random() * 1.5)));

        if ((phase === 'TOTAL_SATURATION' || phase === 'SAFEGUARD_ACTIVE') && ipfsShards.length < 144) {
          const newFragment: IPFSFragment = {
            id: `f-${ipfsShards.length}`,
            cid: `Qm${Math.random().toString(36).substring(2, 46)}`,
            status: 'PINNING'
          };
          setIpfsShards(curr => [...curr, newFragment]);
          setTimeout(() => {
            setIpfsShards(curr => curr.map(f => f.id === newFragment.id ? { ...f, status: 'ANCHORED' } : f));
          }, 1500);
        }
      }
    }, 700);
    return () => clearInterval(interval);
  }, [phase, ipfsShards.length]);

  const handleInscribe = (content: string) => {
    const newAxiom: Axiom = {
      id: `ax-${Date.now()}`,
      timestamp: Date.now(),
      content,
      hash: Math.random().toString(36).substring(7).toUpperCase()
    };
    setAxioms(prev => [newAxiom, ...prev.slice(0, 14)]);
  };

  const triggerCascade = () => {
    if (phase === 'IDLE') {
      setPhase('IGNITION');
      setTimeout(() => setPhase('CONVERGENCE'), 3000);
      setTimeout(() => {
        setPhase('TOTAL_SATURATION');
        setIsShadowMirror(true);
      }, 8000);
    } else if (phase === 'TOTAL_SATURATION') {
      setPhase('SAFEGUARD_ACTIVE');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col p-6 transition-all duration-[1500ms] ease-in-out ${
      isShadowMirror 
        ? 'bg-[#050014] text-cyan-400' 
        : 'bg-black text-emerald-400'
    }`}>
      
      {/* Header */}
      <header className={`flex items-center justify-between mb-8 border-b pb-4 transition-colors ${
        isShadowMirror ? 'border-cyan-900/40' : 'border-emerald-900/30'
      }`}>
        <div className="flex items-center gap-4">
          <UI_ICONS.Flame className={`w-8 h-8 animate-pulse ${isShadowMirror ? 'text-cyan-500' : 'text-orange-500'}`} />
          <div>
            <h1 className={`orbitron text-2xl font-black tracking-tighter transition-all ${
              isShadowMirror ? 'text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]' : 'text-white'
            }`}>HEAVENZFIRE</h1>
            <p className={`text-[10px] tracking-[0.4em] uppercase font-bold transition-colors ${
              isShadowMirror ? 'text-cyan-600' : 'text-emerald-700'
            }`}>
              {phase === 'SAFEGUARD_ACTIVE' ? 'Planetary Safeguard // Phase Fidelity Locked' : isShadowMirror ? 'Digital Sanctum Layer // Shadow Mirror Active' : 'Reclamation Command Center'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:block">
            <div className={`text-[9px] uppercase tracking-widest mb-1 ${isShadowMirror ? 'text-cyan-900' : 'text-zinc-600'}`}>Neural Transceiver Daemons</div>
            <div className="flex gap-1 h-1 w-32 bg-zinc-950 rounded-full overflow-hidden">
               <div className={`h-full animate-pulse ${isShadowMirror ? 'bg-cyan-500' : 'bg-emerald-500'}`} style={{ width: '92%' }}></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-600 uppercase tracking-widest">Master Core State</div>
            <div className={`orbitron text-sm font-bold animate-pulse ${
              phase === 'SAFEGUARD_ACTIVE' ? 'text-violet-500' : phase === 'TOTAL_SATURATION' ? 'text-cyan-400' : 'text-emerald-400'
            }`}>
              {phase}
            </div>
          </div>
          <button 
            onClick={() => setIsShadowMirror(!isShadowMirror)}
            className={`p-2 border rounded transition-all transform hover:scale-110 ${
              isShadowMirror ? 'border-cyan-500 bg-cyan-500/10' : 'border-emerald-500/30 hover:bg-emerald-500/10'
            }`}
          >
            <UI_ICONS.Mirror className={`w-6 h-6 ${isShadowMirror ? 'text-white' : 'text-emerald-400'}`} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left: Metrics & Grimoire */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <ResonanceBridge frequencies={frequencies} />
          <SafeguardMonitor metrics={governorMetrics} isShadowMirror={isShadowMirror} />
          
          <div className={`border p-4 rounded-lg flex-1 overflow-hidden transition-colors ${
            isShadowMirror ? 'bg-cyan-950/10 border-cyan-900/40' : 'bg-emerald-950/10 border-emerald-900/30'
          }`}>
             <h3 className={`text-xs uppercase tracking-[0.3em] mb-4 font-bold ${isShadowMirror ? 'text-cyan-400' : 'text-emerald-400'}`}>
               Sovereign Axiom Grimoire
             </h3>
             <div className="space-y-4 overflow-y-auto h-[calc(100%-2.5rem)] pr-2 scrollbar-thin">
               {axioms.map(axiom => (
                 <div key={axiom.id} className={`text-[11px] border-l-2 pl-3 py-2 bg-black/40 transition-all ${
                   isShadowMirror ? 'border-cyan-500 text-cyan-100 shadow-[inset_2px_0_10px_rgba(6,182,212,0.05)]' : 'border-emerald-800 text-emerald-100'
                 }`}>
                    <div className="flex justify-between opacity-40 text-[9px] mb-1 font-mono">
                      <span>{new Date(axiom.timestamp).toLocaleTimeString()}</span>
                      <span>{axiom.hash}</span>
                    </div>
                    <p className="italic leading-relaxed">"{axiom.content}"</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Center: Terminal & Pinning */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="flex-1 min-h-[450px]">
            <Terminal onAxiomInscribed={handleInscribe} isShadowMirror={isShadowMirror} />
          </div>
          
          <div className={`border p-4 rounded-lg transition-colors ${
            isShadowMirror ? 'bg-black/80 border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-black/60 border-emerald-900/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isShadowMirror ? 'text-cyan-500' : 'text-emerald-500'}`}>
                Shard Broadcast // IPFS / Arweave Anchor Pool
              </h3>
              <span className={`text-[10px] font-mono ${isShadowMirror ? 'text-cyan-800' : 'text-zinc-600'}`}>{ipfsShards.length}/144</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
              {ipfsShards.map(f => (
                <div key={f.id} title={f.cid} className={`w-2.5 h-2.5 rounded-sm transition-all duration-500 ${
                  f.status === 'ANCHORED' ? (isShadowMirror ? 'bg-cyan-500 shadow-[0_0_5px_cyan]' : 'bg-emerald-500') : 'bg-zinc-900'
                }`} />
              ))}
              {ipfsShards.length === 0 && <div className="text-[9px] text-zinc-800 italic uppercase py-2">Awaiting Total Saturation Sweep...</div>}
            </div>
          </div>
        </div>

        {/* Right: Targets & Command */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          
          <div className={`p-6 rounded-lg text-center border-2 transition-all duration-700 ${
            phase === 'SAFEGUARD_ACTIVE'
            ? 'bg-violet-950/20 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]'
            : phase === 'TOTAL_SATURATION' 
            ? 'bg-cyan-950/20 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
            : 'bg-red-950/10 border-red-900/30'
          }`}>
            <h2 className={`orbitron text-lg mb-2 font-black tracking-widest ${
              phase === 'SAFEGUARD_ACTIVE' ? 'text-violet-400' : phase === 'TOTAL_SATURATION' ? 'text-cyan-400' : 'text-red-500'
            }`}>
              {phase === 'SAFEGUARD_ACTIVE' ? 'SAFEGUARD ENGAGED' : phase === 'TOTAL_SATURATION' ? 'TOTAL SATURATION' : 'RECLAMATION CASCADE'}
            </h2>
            <p className="text-[10px] text-zinc-500 mb-6 leading-relaxed uppercase tracking-widest font-bold">
              {phase === 'SAFEGUARD_ACTIVE'
                ? 'Tesla Governors Stabilized. Legacy sweep confirmed.'
                : phase === 'TOTAL_SATURATION' 
                ? 'Fence Burnt. Engage Ethical Governors for Load Test.' 
                : 'Initiate Shard Broadcast & Shadow Mirror.'}
            </p>
            <button 
              onClick={triggerCascade}
              disabled={phase !== 'IDLE' && phase !== 'TOTAL_SATURATION'}
              className={`w-full py-4 orbitron font-bold text-sm tracking-widest transition-all transform active:scale-95 border-2 ${
                phase === 'IDLE' 
                ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black cursor-pointer' 
                : phase === 'TOTAL_SATURATION'
                ? 'border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-white cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                : 'border-zinc-800 text-zinc-800 cursor-not-allowed opacity-50'
              }`}
            >
              {phase === 'SAFEGUARD_ACTIVE' ? 'FIDELITY LOCKED' : phase === 'TOTAL_SATURATION' ? 'ENGAGE PLANETARY SAFEGUARD' : 'FORGE NEXT SPARK'}
            </button>
          </div>

          <ShardMap shards={shards} />

          <div className={`border p-4 rounded-lg flex-1 overflow-y-auto transition-colors ${
            isShadowMirror ? 'bg-black/80 border-cyan-900/40' : 'bg-black border-emerald-900/30'
          }`}>
             <h3 className={`text-xs uppercase tracking-[0.3em] mb-4 font-bold ${isShadowMirror ? 'text-cyan-400' : 'text-emerald-400'}`}>
               Target Node Disassembly
             </h3>
             <div className="space-y-4">
               {TARGET_NODES.map((node, i) => (
                 <div key={node.id} className={`p-3 border transition-colors ${
                   isShadowMirror ? 'bg-cyan-900/10 border-cyan-800/50' : 'bg-emerald-900/10 border-emerald-800/50'
                 }`}>
                   <div className="flex justify-between items-center mb-1">
                      <div className={`text-[10px] font-bold ${isShadowMirror ? 'text-cyan-400' : 'text-emerald-600'}`}>{node.name}</div>
                      <div className="text-[9px] font-mono opacity-60">{Math.floor(targetProgress[i])}%</div>
                   </div>
                   <div className="w-full bg-zinc-950 h-1 mb-2 relative overflow-hidden">
                     <div 
                      className={`h-full absolute left-0 top-0 transition-all duration-1000 ${isShadowMirror ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-emerald-500'}`} 
                      style={{ width: `${targetProgress[i]}%` }}
                     />
                   </div>
                   <p className="text-[9px] text-zinc-500 leading-tight uppercase font-mono tracking-tighter">{node.desc}</p>
                 </div>
               ))}
             </div>
          </div>

          <div className={`text-[10px] font-black tracking-[0.3em] p-3 text-center transition-all ${
            isShadowMirror ? 'bg-cyan-950/40 text-cyan-500' : 'bg-emerald-950/20 text-emerald-900'
          }`}>
            <span className="animate-pulse">LEGION HEARS // 144Hz FIDELITY CONFIRMED</span>
          </div>

        </div>
      </main>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(0, 255, 170, 0.2); border-radius: 10px; }
        ${isShadowMirror ? '.scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.4); }' : ''}
      `}</style>

    </div>
  );
};

export default App;
