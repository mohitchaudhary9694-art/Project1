import React from 'react';
import { CompetencyDomain } from '../types';

interface RadarDataPoint {
  label: string;
  domain: CompetencyDomain;
  current: number; // 1 to 5
  target: number;  // 1 to 5
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 320 }) => {
  const center = size / 2;
  const radius = size * 0.35;
  const total = data.length;
  const levels = [1, 2, 3, 4, 5];

  // Helper to calculate coordinates
  const getCoordinates = (index: number, value: number, maxVal = 5) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (value / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string
  const currentPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.current);
      return `${x},${y}`;
    })
    .join(' ');

  const targetPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.target);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Background concentric polygons for levels 1 to 5 */}
        {levels.map((lvl) => {
          const polygonPts = data
            .map((_, i) => {
              const { x, y } = getCoordinates(i, lvl);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <g key={lvl}>
              <polygon
                points={polygonPts}
                fill={lvl % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}
                stroke="#CBD5E1"
                strokeDasharray={lvl === 5 ? 'none' : '3 3'}
                strokeWidth={lvl === 5 ? '1.5' : '1'}
              />
              <text
                x={center}
                y={center - (lvl / 5) * radius + 4}
                className="text-[9px] font-mono fill-slate-400 text-center"
                textAnchor="middle"
              >
                {lvl}
              </text>
            </g>
          );
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(i, 5);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#CBD5E1"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Target Benchmark Area (Dashed Green/Emerald) */}
        <polygon
          points={targetPoints}
          fill="rgba(16, 185, 129, 0.12)"
          stroke="#059669"
          strokeWidth="2"
          strokeDasharray="5 4"
        />

        {/* Current Officer Proficiency Area (Primary Blue Fill) */}
        <polygon
          points={currentPoints}
          fill="rgba(30, 58, 186, 0.2)"
          stroke="#1E3ABA"
          strokeWidth="2.5"
        />

        {/* Data points (Current - Primary Blue) */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.current);
          return (
            <circle
              key={`curr-${i}`}
              cx={x}
              cy={y}
              r="4.5"
              fill="#1E3ABA"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="drop-shadow-xs"
            />
          );
        })}

        {/* Data points (Target - Emerald) */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.target);
          return (
            <circle
              key={`tgt-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="#059669"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
          const labelRadius = radius + 28;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);

          const textAnchor = Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';

          return (
            <g key={`lbl-${i}`}>
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                className="text-[11px] font-bold fill-slate-800 font-heading"
              >
                {d.label}
              </text>
              <text
                x={x}
                y={y + 13}
                textAnchor={textAnchor}
                className="text-[10px] font-mono fill-[#1E3ABA] font-bold"
              >
                Lvl {d.current} / {d.target}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-[#1E3ABA]">
          <span className="w-3.5 h-3.5 rounded bg-[#1E3ABA]/30 border border-[#1E3ABA]"></span>
          <span>Current Officer Proficiency</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700">
          <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-600 border-dashed"></span>
          <span>Role Cadre Benchmark (Target)</span>
        </div>
      </div>
    </div>
  );
};
