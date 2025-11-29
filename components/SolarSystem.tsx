
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Sun from './Sun';
import Planet from './Planet';
import { PLANETS } from '../constants';
import { PlanetData } from '../types';

interface SolarSystemProps {
  selectedPlanet: PlanetData | null;
  onPlanetSelect: (planet: PlanetData) => void;
}

// Manages the global simulation time.
// We use a ref for time so we can slow it down or pause it without checking system clock.
const TimeController = ({ 
  timeRef, 
  speedFactorRef 
}: { 
  timeRef: React.MutableRefObject<number>, 
  speedFactorRef: React.MutableRefObject<number> 
}) => {
  useFrame((state, delta) => {
    // Increment simulation time based on delta and current speed factor
    // If hovering, speedFactorRef.current will be low (e.g., 0.1), making time pass slowly
    timeRef.current += delta * speedFactorRef.current;
  });
  return null;
};

// Controls the camera movement and focus
const CameraRig = ({ 
  selectedPlanet,
  timeRef 
}: { 
  selectedPlanet: PlanetData | null,
  timeRef: React.MutableRefObject<number>
}) => {
  const { camera, controls } = useThree();
  const vec = new THREE.Vector3();

  useFrame((state, delta) => {
    const orbitControls = controls as any;
    if (!orbitControls) return;

    if (selectedPlanet) {
      // 1. Calculate the exact position of the moving planet using CUSTOM timeRef
      // This ensures camera stays synced even when we slow down time on hover
      const t = timeRef.current * selectedPlanet.speed + selectedPlanet.startAngle;
      const x = Math.cos(t) * selectedPlanet.distance;
      const z = Math.sin(t) * selectedPlanet.distance;
      const planetPos = new THREE.Vector3(x, 0, z);

      // 2. Smoothly move the focus target to the planet
      orbitControls.target.lerp(planetPos, 0.1);

      // 3. Camera Follow Logic
      const dist = selectedPlanet.radius * 8 + 5;
      const currentDist = camera.position.distanceTo(planetPos);
      
      orbitControls.minDistance = selectedPlanet.radius * 2;
      orbitControls.maxDistance = selectedPlanet.radius * 20;

      // Gentle zoom in if we are too far
      if (currentDist > dist * 1.5) {
        vec.subVectors(camera.position, planetPos).normalize().multiplyScalar(dist).add(planetPos);
        camera.position.lerp(vec, 0.05);
      }

    } else {
      // Reset to overview
      orbitControls.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      orbitControls.minDistance = 20;
      orbitControls.maxDistance = 500;
      
      // Pull back if too close
      if (camera.position.length() < 60) {
        camera.position.lerp(new THREE.Vector3(0, 80, 120), 0.05);
      }
    }

    orbitControls.update();
  });

  return null;
};

const SolarSystem: React.FC<SolarSystemProps> = ({ selectedPlanet, onPlanetSelect }) => {
  // Shared mutable refs for simulation state
  // timeRef: Total elapsed "simulation" seconds
  const timeRef = useRef(0);
  // speedFactorRef: Multiplier for time (1 = normal, 0.1 = slow)
  const speedFactorRef = useRef(1);

  return (
    <Canvas camera={{ position: [0, 80, 120], fov: 45 }}>
      <Suspense fallback={null}>
        <TimeController timeRef={timeRef} speedFactorRef={speedFactorRef} />

        <color attach="background" args={['#050505']} />
        <Stars radius={300} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={1.5} distance={300} decay={1} />

        {/* Enable Pan allowed for dual-finger drag */}
        <OrbitControls 
          makeDefault 
          enablePan={true} 
          enableZoom={true} 
          maxDistance={300}
          minDistance={10}
        />
        
        <CameraRig selectedPlanet={selectedPlanet} timeRef={timeRef} />

        <Sun />
        
        {PLANETS.map((planet) => (
          <Planet 
            key={planet.id} 
            data={planet} 
            isSelected={selectedPlanet?.id === planet.id}
            onSelect={onPlanetSelect}
            timeRef={timeRef}
            speedFactorRef={speedFactorRef}
          />
        ))}

      </Suspense>
    </Canvas>
  );
};

export default SolarSystem;
