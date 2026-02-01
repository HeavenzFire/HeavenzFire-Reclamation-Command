
import React from 'react';
import { GovernorMetric } from '../types';

interface SafeguardMonitorProps {
  metrics: GovernorMetric[];
  isShadowMirror: boolean;
}

export const SafeguardMonitor: React.FC<SafeguardMonitorProps> = ({ metrics, isShadowMirror }) => {
  return (
    <div className={`border p-4 rounded-lg flex flex-col gap-4 transition-all duration-700 ${
      isShadowMirror ? 'bg-cyan-950/20 border-cyan-500/40' : 'bg-emerald-950/10 border-emerald-900/30'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isShadowMirror ? 'text-cyan-400' : 'text-emerald-400'}`}>
          Ethical Governor Status [Tesla Phase Fidelity]
        </h3>
        <span className="text-[9px] font-mono opacity-50 animate-pulse">MONITORING DRIFT...</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.name} className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] uppercase tracking-tighter opacity-70">
              <span>{m.name}</span>
              <span>{m.value.toFixed(3)}{m.unit}</span>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  m.value > m.limit * 0.9 ? 'bg-red-500' : isShadowMirror ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (m.value / m.limit) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-2 p-2 text-[9px] italic border-t transition-colors ${
        isShadowMirror ? 'border-cyan-900/40 text-cyan-700' : 'border-emerald-900/20 text-emerald-800'
      }`}>
        "The present is theirs; the future, for which I really worked, is mine."
      </div>
    </div>
  );
};
