import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import Marble from './Marble';
import * as THREE from 'three';

interface MarbleSceneProps {
  redMarbles: number;
  blueMarbles: number;
  showMarbles: boolean;
}

const MarbleScene: React.FC<MarbleSceneProps> = ({ redMarbles, blueMarbles, showMarbles }) => {
  const positions = useRef<Array<[number, number, number]>>([]);
  
  // Generate positions for marbles if they haven't been generated yet
  if (positions.current.length === 0) {
    const generatePositions = (count: number): Array<[number, number, number]> => {
      const positions: Array<[number, number, number]> = [];
      const spacing = 0.6;
      
      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        positions.push([col * spacing - 1.2, 0, row * spacing - 0.6]);
      }
      
      return positions;
    };
    
    positions.current = generatePositions(redMarbles + blueMarbles);
  }
  
  return (
    <div className="w-full h-80 bg-gray-50 rounded-lg shadow-inner relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 3, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Red marbles */}
        {Array.from({ length: redMarbles }).map((_, i) => (
          <Marble 
            key={`red-${i}`}
            position={positions.current[i]}
            color="red"
            visible={showMarbles}
          />
        ))}
        
        {/* Blue marbles */}
        {Array.from({ length: blueMarbles }).map((_, i) => (
          <Marble 
            key={`blue-${i}`}
            position={positions.current[i + redMarbles]}
            color="blue"
            visible={showMarbles}
          />
        ))}
        
        {/* Plateau/table */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#f9f5eb" />
        </mesh>
        
        <OrbitControls
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.5}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};

export default MarbleScene;
