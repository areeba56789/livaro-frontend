// @ts-nocheck
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, Float } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCube({ isResolving }: { isResolving: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        {isResolving ? (
          // Frosted glass cube when resolved
          <meshPhysicalMaterial
            transparent
            transmission={1}
            opacity={1}
            roughness={0.2}
            thickness={2}
            ior={1.5}
            clearcoat={1}
            color="#2dd4bf"
          />
        ) : (
          // Neon wireframe when loading
          <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.3} />
        )}
        
        {/* Glowing edges for both states */}
        <Edges
          linewidth={2}
          threshold={15}
          color={isResolving ? "#ccfbf1" : "#0ea5e9"}
        />
      </mesh>
    </Float>
  );
}

export default function ThreeDProperty({ isResolving = false }: { isResolving?: boolean }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0ea5e9" />
        <RotatingCube isResolving={isResolving} />
      </Canvas>
    </div>
  );
}
