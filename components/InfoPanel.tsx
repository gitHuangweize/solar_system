import React from 'react';
import { PlanetData } from '../types';

interface InfoPanelProps {
  planet: PlanetData | null;
  geminiFact: string | null;
  loading: boolean;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ planet, geminiFact, loading, onClose }) => {
  if (!planet) {
    return (
      <div className="absolute top-4 left-4 z-10 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white max-w-xs">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          太阳系漫游
        </h1>
        <p className="text-gray-300 text-sm mt-2">
          Solar System Explorer
        </p>
        <div className="mt-4 text-xs text-gray-400">
          <p>👆 点击行星查看详情</p>
          <p>🖱️ 拖动鼠标旋转视角</p>
          <p>🔍 滚动滚轮缩放</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 w-80 p-6 rounded-2xl bg-slate-900/80 backdrop-blur-lg border border-slate-700 shadow-2xl text-white transition-all duration-300 animate-in slide-in-from-right-10">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-3xl font-bold mb-1" style={{ color: planet.color }}>
        {planet.name.split(' ')[0]}
      </h2>
      <p className="text-slate-400 text-sm mb-4 font-mono">{planet.name.split(' ')[1]}</p>

      <div className="space-y-4">
        <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-sm text-gray-300 mb-1">基础数据</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>距离太阳: {planet.distance} AU (Scale)</div>
                <div>相对大小: {planet.radius}x</div>
                <div>公转速度: {planet.speed}x</div>
            </div>
        </div>

        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
             <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">Gemini AI 分析</span>
          </div>
          
          {loading ? (
            <div className="flex space-x-1 items-center h-16 justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-blue-100">
              {geminiFact || planet.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
