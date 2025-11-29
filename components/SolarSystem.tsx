
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Sun from './Sun';
import Planet from './Planet';
import WarpTunnel from './WarpTunnel';
import { PLANETS } from '../constants';
import { PlanetData, OnTravelComplete } from '../types';

interface SolarSystemProps {
  selectedPlanet: PlanetData | null;
  onPlanetSelect: (planet: PlanetData) => void;
  travelTarget: PlanetData | null;
  onTravelComplete: OnTravelComplete;
  travelSpeed: number;
}

// Manages the global simulation time.
const TimeController = ({ 
  timeRef, 
  speedFactorRef 
}: { 
  timeRef: React.MutableRefObject<number>, 
  speedFactorRef: React.MutableRefObject<number> 
}) => {
  useFrame((state, delta) => {
    timeRef.current += delta * speedFactorRef.current;
  });
  return null;
};

// Controls the camera movement, focus, and travel animation
const CameraRig = ({ 
  selectedPlanet,
  travelTarget,
  timeRef,
  onTravelComplete,
  setWarpActive,
  travelSpeed
}: { 
  selectedPlanet: PlanetData | null,
  travelTarget: PlanetData | null,
  timeRef: React.MutableRefObject<number>,
  onTravelComplete: OnTravelComplete,
  setWarpActive: (active: boolean) => void,
  travelSpeed: number
}) => {
  const { camera, controls } = useThree();
  const vec = new THREE.Vector3();
  const targetPosRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const orbitControls = controls as any;
    if (!orbitControls) return;

    // --- TRAVEL MODE ---
    if (travelTarget) {
      orbitControls.enabled = false; // Disable user control during travel

      // Calculate destination position
      const t = timeRef.current * travelTarget.speed + travelTarget.startAngle;
      const tx = Math.cos(t) * travelTarget.distance;
      const tz = Math.sin(t) * travelTarget.distance;
      targetPosRef.current.set(tx, 0, tz);

      // Distance to target
      const distToTarget = camera.position.distanceTo(targetPosRef.current);
      const stopDistance = travelTarget.radius * 5 + 5;

      // Make camera look at target
      orbitControls.target.lerp(targetPosRef.current, 0.1);
      
      // Move camera towards target
      if (distToTarget > stopDistance) {
        // Accelerate/Decelerate logic
        // Base max speed * multiplier
        const maxSpeed = 100 * travelSpeed;
        
        // Easing logic: speed is proportional to distance, but clamped by maxSpeed
        // Increased the multiplier from 3 to (2 + travelSpeed) to make high speeds feel snappier on acceleration
        let speed = Math.min(distToTarget, maxSpeed) * (2 + travelSpeed * 0.5) * delta;
        
        // Ensure minimum speed so we don't stall, also scaled by travelSpeed
        speed = Math.max(speed, (5 * travelSpeed) * delta);

        const direction = new THREE.Vector3().subVectors(targetPosRef.current, camera.position).normalize();
        camera.position.add(direction.multiplyScalar(speed));
        
        // Activate Warp effect if moving fast
        if (speed > 10 * delta && distToTarget > 50) {
            setWarpActive(true);
            // Shake effect intensity based on speed
            const shake = 0.1 * travelSpeed;
            camera.position.x += (Math.random() - 0.5) * shake;
            camera.position.y += (Math.random() - 0.5) * shake;
        } else {
            setWarpActive(false);
        }

      } else {
        // Arrived
        setWarpActive(false);
        onTravelComplete();
        orbitControls.enabled = true;
      }
      return;
    }

    // --- ORBIT/OBSERVATION MODE ---
    orbitControls.enabled = true;
    setWarpActive(false);

    if (selectedPlanet) {
      const t = timeRef.current * selectedPlanet.speed + selectedPlanet.startAngle;
      const x = Math.cos(t) * selectedPlanet.distance;
      const z = Math.sin(t) * selectedPlanet.distance;
      const planetPos = new THREE.Vector3(x, 0, z);

      orbitControls.target.lerp(planetPos, 0.1);

      const dist = selectedPlanet.radius * 8 + 5;
      const currentDist = camera.position.distanceTo(planetPos);
      
      orbitControls.minDistance = selectedPlanet.radius * 2;
      orbitControls.maxDistance = selectedPlanet.radius * 20;

      if (currentDist > dist * 1.5) {
        vec.subVectors(camera.position, planetPos).normalize().multiplyScalar(dist).add(planetPos);
        camera.position.lerp(vec, 0.05);
      }
    } else {
      // Default Sun view
      orbitControls.target.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      orbitControls.minDistance = 20;
      orbitControls.maxDistance = 500;
      
      if (camera.position.length() < 60) {
        camera.position.lerp(new THREE.Vector3(0, 80, 120), 0.05);
      }
    }

    orbitControls.update();
  });

  return null;
};

// Component to attach WarpTunnel to Camera so it moves with it
const CameraAttachment = ({ children }: { children: React.ReactNode }) => {
    const { camera } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(camera.position);
            groupRef.current.quaternion.copy(camera.quaternion);
            // Move it slightly in front of camera
            groupRef.current.translateZ(-20);
        }
    });

    return <group ref={groupRef}>{children}</group>;
};

const SolarSystem: React.FC<SolarSystemProps> = ({ 
  selectedPlanet, 
  onPlanetSelect, 
  travelTarget,
  onTravelComplete,
  travelSpeed
}) => {
  const timeRef = useRef(0);
  const speedFactorRef = useRef(1);
  const [warpActive, setWarpActive] = useState(false);

  return (
    <Canvas camera={{ position: [0, 80, 120], fov: 60 }}>
      <Suspense fallback={null}>
        <TimeController timeRef={timeRef} speedFactorRef={speedFactorRef} />

        <color attach="background" args={['#020205']} />
        
        {/* Dynamic Stars */}
        <Stars radius={300} depth={50} count={6000} factor={4} saturation={0} fade speed={warpActive ? 5 + travelSpeed : 1} />
        
        {/* Warp Effect attached to camera */}
        <CameraAttachment>
             <WarpTunnel active={warpActive} />
        </CameraAttachment>

        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={1.5} distance={300} decay={1} />

        <OrbitControls 
          makeDefault 
          enablePan={true} 
          enableZoom={true} 
          maxDistance={400}
          minDistance={5}
        />
        
        <CameraRig 
            selectedPlanet={selectedPlanet} 
            travelTarget={travelTarget}
            timeRef={timeRef} 
            onTravelComplete={onTravelComplete}
            setWarpActive={setWarpActive}
            travelSpeed={travelSpeed}
        />

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
