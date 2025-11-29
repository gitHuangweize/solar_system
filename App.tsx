
import React, { useState, useEffect } from 'react';
import SolarSystem from './components/SolarSystem';
import InfoPanel from './components/InfoPanel';
import { PlanetData } from './types';
import { PLANETS } from './constants';
import { getPlanetFunFact } from './services/geminiService';

const App: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [geminiFact, setGeminiFact] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Travel Game State
  const [travelTarget, setTravelTarget] = useState<PlanetData | null>(null);
  const [isNavigating, setIsNavigating] = useState(false); // UI state for showing planet list
  const [travelSpeed, setTravelSpeed] = useState<number>(1); // 1x to 5x speed

  // Fetch data when a planet is selected (and we are not just traveling through it)
  useEffect(() => {
    if (selectedPlanet && !travelTarget) {
      setLoading(true);
      setGeminiFact(null);
      
      const fetchData = async () => {
        const fact = await getPlanetFunFact(selectedPlanet.name);
        setGeminiFact(fact);
        setLoading(false);
      };

      fetchData();
    } else if (!selectedPlanet) {
      setGeminiFact(null);
    }
  }, [selectedPlanet, travelTarget]);

  const handlePlanetSelect = (planet: PlanetData) => {
    if (travelTarget) return; // Disable selection during travel
    if (selectedPlanet?.id === planet.id) return;
    setSelectedPlanet(planet);
    setIsNavigating(false);
  };

  const handleClosePanel = () => {
    setSelectedPlanet(null);
  };

  // Start the travel sequence
  const startTravel = (planet: PlanetData) => {
    setIsNavigating(false);
    setSelectedPlanet(null); // Deselect current
    setTravelTarget(planet); // Start travel rig
  };

  // Called by 3D scene when travel is done
  const onTravelComplete = () => {
    if (travelTarget) {
        setSelectedPlanet(travelTarget);
        setTravelTarget(null);
    }
  };

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <SolarSystem 
          selectedPlanet={selectedPlanet} 
          onPlanetSelect={handlePlanetSelect}
          travelTarget={travelTarget}
          onTravelComplete={onTravelComplete}
          travelSpeed={travelSpeed}
        />
      </div>

      {/* Main Info UI */}
      {!travelTarget && (
        <InfoPanel 
            planet={selectedPlanet} 
            geminiFact={geminiFact}
            loading={loading}
            onClose={handleClosePanel}
        />
      )}

      {/* Travel Status Indicator */}
      {travelTarget && (
        <div className="absolute top-10 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <div className="bg-blue-900/80 backdrop-blur border border-blue-400 text-blue-100 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse flex items-center gap-3">
                <span className="animate-spin text-xl">⚙️</span>
                <span className="font-mono font-bold tracking-widest">
                  正在前往 {travelTarget.name}... (引擎: {travelSpeed}x)
                </span>
            </div>
        </div>
      )}

      {/* Navigation Controls (Game UI) */}
      {!travelTarget && (
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-4">
            
            {/* Nav Menu */}
            {isNavigating && (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-600 rounded-lg p-4 w-64 shadow-2xl animate-in slide-in-from-bottom-5">
                    <h3 className="text-blue-400 font-bold mb-3 border-b border-slate-700 pb-2 flex justify-between items-center">
                        <span>星际导航系统</span>
                        <button onClick={() => setIsNavigating(false)} className="text-gray-400 hover:text-white">&times;</button>
                    </h3>
                    
                    {/* Speed Control Slider */}
                    <div className="mb-4 px-1">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>引擎功率</span>
                        <span className="text-blue-300 font-mono">{travelSpeed.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="5.0" 
                        step="0.5" 
                        value={travelSpeed}
                        onChange={(e) => setTravelSpeed(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                      />
                    </div>

                    <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                        {PLANETS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => startTravel(p)}
                                disabled={selectedPlanet?.id === p.id}
                                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 transition-all
                                    ${selectedPlanet?.id === p.id 
                                        ? 'bg-blue-900/20 text-blue-500 cursor-default opacity-50' 
                                        : 'hover:bg-blue-600 hover:text-white text-gray-300'
                                    }
                                `}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                                <span className="text-sm font-mono">{p.name.split(' ')[0]}</span>
                                {selectedPlanet?.id === p.id && <span className="ml-auto text-xs">[当前]</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button 
                onClick={() => setIsNavigating(!isNavigating)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all shadow-lg
                    ${isNavigating 
                        ? 'bg-blue-600 text-white hover:bg-blue-500' 
                        : 'bg-slate-800 text-blue-400 border border-blue-900 hover:border-blue-500 hover:text-blue-300'
                    }
                `}
            >
                <span className="text-xl group-hover:rotate-90 transition-transform duration-300">🚀</span>
                <span>{isNavigating ? '关闭导航' : '星际穿越'}</span>
            </button>
          </div>
      )}
    </div>
  );
};

export default App;
