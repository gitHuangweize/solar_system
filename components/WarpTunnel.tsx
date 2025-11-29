import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WarpTunnelProps {
  active: boolean;
}

const WarpTunnel: React.FC<WarpTunnelProps> = ({ active }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create stars geometry once
  const starsGeometry = React.useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random position in a cylinder around the camera
      const r = 20 + Math.random() * 50; // radius
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 400; // depth
      
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(theta);
      positions[i * 3 + 2] = z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    if (!active) {
      pointsRef.current.visible = false;
      return;
    }
    
    pointsRef.current.visible = true;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Move stars towards camera (positive Z) to simulate moving forward (negative Z)
    // Or actually, we usually move camera towards target. 
    // Let's make stars move along Z axis relative to camera.
    const speed = 200 * delta; 
    
    for (let i = 0; i < positions.length / 3; i++) {
      let z = positions[i * 3 + 2];
      z += speed;
      if (z > 100) z -= 400; // Recycle star to back
      positions[i * 3 + 2] = z;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slight rotation for dynamic feel
    pointsRef.current.rotation.z += delta * 0.5;
  });

  return (
    <group rotation={[0, 0, 0]}>
      {/* We attach this to the camera in the parent component logic usually, 
          but here we put it in scene. To make it look like warp, 
          we rely on the CameraRig to position the camera, 
          but for a true warp effect relative to screen, 
          it's often easier to parent it to camera or update its position to match camera.
          For simplicity in this setup, we will just render it and let the camera fly through it.
      */}
      <points ref={pointsRef}>
        <primitive object={starsGeometry} />
        <pointsMaterial
          size={0.5}
          color="#88CCFF"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default WarpTunnel;
