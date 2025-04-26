
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const TeacherModel = ({ currentState }) => {
  const gltfRef = useRef();
  const { scene } = useGLTF('/models/Megan.glb');

  useEffect(() => {
    // Animation logic would go here based on currentState
    // This would be implemented once the model is available
  }, [currentState]);

  return (
    <group ref={gltfRef} position={[0, -1.5, 0]}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
};

export default TeacherModel;
