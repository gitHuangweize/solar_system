import React, { useState, useEffect } from 'react';
import SolarSystem from './components/SolarSystem';
import InfoPanel from './components/InfoPanel';
import { PlanetData } from './types';
import { getPlanetFunFact } from './services/geminiService';

const App: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [geminiFact, setGeminiFact] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data when a planet is selected
  useEffect(() => {
    if (selectedPlanet) {
      setLoading(true);
      setGeminiFact(null);
      
      const fetchData = async () => {
        const fact = await getPlanetFunFact(selectedPlanet.name);
        setGeminiFact(fact);
        setLoading(false);
      };

      fetchData();
    } else {
      setGeminiFact(null);
    }
  }, [selectedPlanet]);

  const handlePlanetSelect = (planet: PlanetData) => {
    if (selectedPlanet?.id === planet.id) return;
    setSelectedPlanet(planet);
  };

  const handleClosePanel = () => {
    setSelectedPlanet(null);
  };

  return (
    <div className="w-full h-screen relative bg-black">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <SolarSystem 
          selectedPlanet={selectedPlanet} 
          onPlanetSelect={handlePlanetSelect} 
        />
      </div>

      {/* UI Layer */}
      <InfoPanel 
        planet={selectedPlanet} 
        geminiFact={geminiFact}
        loading={loading}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default App;
