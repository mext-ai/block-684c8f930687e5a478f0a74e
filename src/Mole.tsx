import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface MoleProps {
  position: [number, number, number];
  isUp: boolean;
  onHit: () => void;
}

const Mole: React.FC<MoleProps> = ({ position, isUp, onHit }) => {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [targetY, setTargetY] = useState(position[1]);

  // Animate mole up/down movement
  useFrame(() => {
    if (meshRef.current) {
      const newTargetY = isUp ? position[1] + 1 : position[1];
      setTargetY(newTargetY);
      
      // Smooth animation
      const currentY = meshRef.current.position.y;
      const diff = newTargetY - currentY;
      meshRef.current.position.y += diff * 0.1;
    }
  });

  const handleClick = () => {
    if (isUp) {
      onHit();
    }
  };

  return (
    <group position={position}>
      {/* Hole */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Mole */}
      <mesh
        ref={meshRef}
        position={[0, position[1], 0]}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={isHovered && isUp ? 1.1 : 1}
      >
        {/* Mole body */}
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color={isUp ? "#654321" : "#8B4513"} />
        
        {/* Mole eyes */}
        <mesh position={[-0.2, 0.2, 0.4]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.2, 0.2, 0.4]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        
        {/* Mole nose */}
        <mesh position={[0, 0, 0.5]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      </mesh>
    </group>
  );
};

export default Mole;