import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Sun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      {/* Glow effect simulated with PointLight */}
      <pointLight position={[0, 0, 0]} intensity={2.5} distance={200} decay={1} color="#FFF" />
      <pointLight position={[0, 0, 0]} intensity={1} distance={50} decay={2} color="#FFA500" />
      
      {/* Outer glow aura mesh */}
       <mesh>
        <sphereGeometry args={[6.5, 32, 32]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

export default Sun;
