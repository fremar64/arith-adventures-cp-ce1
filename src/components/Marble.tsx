
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MarbleProps {
  position: [number, number, number];
  color: 'red' | 'blue';
  visible: boolean;
}

const Marble: React.FC<MarbleProps> = ({ position, color, visible }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  
  // Simple hover animation
  useFrame(() => {
    if (ref.current && hover) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });
  
  const marbleColor = color === 'red' ? '#ff4136' : '#0074D9';
  
  if (!visible) return null;
  
  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      visible={visible}
      castShadow
    >
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial 
        color={marbleColor}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
};

export default Marble;
