
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ResonanceBridgeProps {
  frequencies: { hz33: number; hz528: number; hz144: number };
}

export const ResonanceBridge: React.FC<ResonanceBridgeProps> = ({ frequencies }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 150;
    
    svg.selectAll("*").remove();

    const data = [
      { hz: 33, val: frequencies.hz33, color: '#ff3300' },
      { hz: 528, val: frequencies.hz528, color: '#00ccff' },
      { hz: 144, val: frequencies.hz144, color: '#00ffaa' }
    ];

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.hz.toString()))
      .padding(0.4);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 100]);

    // Draw bars with glow
    const bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g");

    bars.append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.hz.toString()) || 0)
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.val))
      .attr("height", d => height - y(d.val))
      .attr("fill", d => d.color)
      .attr("filter", "url(#glow)");

    // Add labels
    bars.append("text")
      .attr("x", d => (x(d.hz.toString()) || 0) + x.bandwidth() / 2)
      .attr("y", height + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "12px")
      .text(d => `${d.hz} Hz`);

    // Define Glow Filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  }, [frequencies]);

  return (
    <div className="flex flex-col items-center bg-black/40 p-4 border border-emerald-900/30 rounded-lg">
      <h3 className="text-xs uppercase tracking-[0.3em] mb-4 text-emerald-400 font-bold">Resonance Bridge Status</h3>
      <svg ref={svgRef} width="600" height="180" viewBox="0 0 600 180" />
    </div>
  );
};
