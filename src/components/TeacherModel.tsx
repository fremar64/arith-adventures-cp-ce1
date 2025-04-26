
import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { GameState } from './GameContainer';

interface TeacherModelProps {
  currentState: number;
}

const TeacherModel: React.FC<TeacherModelProps> = ({ currentState }) => {
  const [modelError, setModelError] = useState(false);
  const gltfRef = useRef();

  // Try to load the model with error handling
  const handleModelError = () => {
    console.error("Failed to load teacher model");
    setModelError(true);
  };

  // Only attempt to load the model if we haven't encountered an error
  if (!modelError) {
    try {
      // Attempt to load the model with a proper error boundary
      useGLTF.preload('/models/Megan.glb');
    } catch (error) {
      console.error("Error preloading model:", error);
      handleModelError();
    }
  }

  // Render a simple placeholder if there's an error
  if (modelError) {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#5f9ea0" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#f5deb3" />
        </mesh>
      </group>
    );
  }

  // Render the actual model if available
  try {
    const { scene } = useGLTF('/models/Megan.glb');
    
    return (
      <group ref={gltfRef} position={[0, -1.5, 0]}>
        <primitive object={scene} scale={1.5} />
      </group>
    );
  } catch (error) {
    // If loading fails during render, show the placeholder
    if (!modelError) {
      console.error("Error loading model during render:", error);
      handleModelError();
    }
    
    // Return placeholder (duplicate code, but necessary for the error case)
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#5f9ea0" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#f5deb3" />
        </mesh>
      </group>
    );
  }
};

export default TeacherModel;
