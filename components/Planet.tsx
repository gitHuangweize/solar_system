
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '../types';

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onSelect: (planet: PlanetData) => void;
  timeRef: React.MutableRefObject<number>;
  speedFactorRef: React.MutableRefObject<number>;
}

const Planet: React.FC<PlanetProps> = ({ data, isSelected, onSelect, timeRef, speedFactorRef }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      // Use the shared simulation time instead of clock.getElapsedTime()
      // This allows the parent TimeController to slow down time globally
      const t = timeRef.current * data.speed + data.startAngle;
      const x = Math.cos(t) * data.distance;
      const z = Math.sin(t) * data.distance;
      meshRef.current.position.set(x, 0, z);
      
      // Rotation on axis can remain constant or scale with time, 
      // keeping it constant looks fine even when orbit slows
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation(); // Prevent triggering on objects behind
    setHover(true);
    // Slow down the entire solar system when hovering a planet
    speedFactorRef.current = 0.1;
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    setHover(false);
    // Resume normal speed
    speedFactorRef.current = 1;
    document.body.style.cursor = 'auto';
  };

  return (
    <group>
      {/* Orbit Path Visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
        <meshBasicMaterial color="#666" opacity={0.4} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Planet Group */}
      <group 
        ref={meshRef} 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data);
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Planet Sphere */}
        <mesh>
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshStandardMaterial 
            color={data.color} 
            emissive={data.color}
            emissiveIntensity={isSelected || hovered ? 0.6 : 0.2}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* Selection/Hover Halo */}
        {(hovered || isSelected) && (
           <mesh>
             <sphereGeometry args={[data.radius * 1.4, 32, 32]} />
             <meshBasicMaterial color={data.color} wireframe opacity={0.5} transparent />
           </mesh>
        )}

        {/* Saturn's Rings */}
        {data.hasRing && (
          <mesh rotation={[-Math.PI / 3, 0, 0]}>
            <ringGeometry args={[data.radius * 1.4, data.radius * 2.5, 64]} />
            <meshStandardMaterial color="#E8D5B5" side={THREE.DoubleSide} opacity={0.9} transparent />
          </mesh>
        )}

        {/* Label */}
        {(hovered || isSelected) && (
          <Html position={[0, data.radius + 1.5, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded border border-gray-600 whitespace-nowrap font-bold shadow-lg">
              {data.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

export default Planet;
