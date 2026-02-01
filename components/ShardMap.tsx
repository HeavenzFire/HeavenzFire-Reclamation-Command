
import React from 'react';
import { ShardNode, NodeStatus } from '../types';

interface ShardMapProps {
  shards: ShardNode[];
}

export const ShardMap: React.FC<ShardMapProps> = ({ shards }) => {
  return (
    <div className="bg-black/40 border border-emerald-900/30 p-4 rounded-lg">
      <h3 className="text-xs uppercase tracking-[0.3em] mb-4 text-emerald-400 font-bold">144-Node Swarm Topology</h3>
      <div className="grid grid-cols-12 gap-1">
        {shards.map((node) => (
          <div
            key={node.id}
            title={`Node ${node.id} | Status: ${node.status}`}
            className={`w-full aspect-square border transition-all duration-300 ${
              node.status === NodeStatus.SOVEREIGN 
                ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(0,255,170,0.5)]' 
                : node.status === NodeStatus.IGNITED
                ? 'bg-orange-500 border-orange-300 animate-pulse'
                : 'bg-zinc-900 border-zinc-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
