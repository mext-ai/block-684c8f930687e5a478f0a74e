import React, { useState, useEffect, useCallback } from 'react';
import Mole from './Mole';

interface GameBoardProps {
  onScoreChange: (score: number) => void;
  gameActive: boolean;
  onGameEnd: () => void;
}

interface MoleState {
  id: number;
  position: [number, number, number];
  isUp: boolean;
  timeUp: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ onScoreChange, gameActive, onGameEnd }) => {
  const [moles, setMoles] = useState<MoleState[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second game

  // Initialize mole positions in a 3x3 grid
  useEffect(() => {
    const initialMoles: MoleState[] = [];
    let id = 0;
    for (let x = -2; x <= 2; x += 2) {
      for (let z = -2; z <= 2; z += 2) {
        initialMoles.push({
          id: id++,
          position: [x, -0.5, z],
          isUp: false,
          timeUp: 0
        });
      }
    }
    setMoles(initialMoles);
  }, []);

  // Game timer
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, onGameEnd]);

  // Mole popping logic
  useEffect(() => {
    if (!gameActive) return;

    const popMole = () => {
      setMoles(prevMoles => {
        const availableMoles = prevMoles.filter(mole => !mole.isUp);
        if (availableMoles.length === 0) return prevMoles;

        const randomMole = availableMoles[Math.floor(Math.random() * availableMoles.length)];
        const popDuration = 1000 + Math.random() * 2000; // 1-3 seconds

        return prevMoles.map(mole => 
          mole.id === randomMole.id 
            ? { ...mole, isUp: true, timeUp: Date.now() + popDuration }
            : mole
        );
      });
    };

    // Pop moles at random intervals
    const popInterval = setInterval(popMole, 800 + Math.random() * 1200);

    // Check for moles that should go down
    const checkMoles = setInterval(() => {
      setMoles(prevMoles => 
        prevMoles.map(mole => 
          mole.isUp && Date.now() > mole.timeUp 
            ? { ...mole, isUp: false, timeUp: 0 }
            : mole
        )
      );
    }, 100);

    return () => {
      clearInterval(popInterval);
      clearInterval(checkMoles);
    };
  }, [gameActive]);

  const handleMoleHit = useCallback((moleId: number) => {
    setMoles(prevMoles => 
      prevMoles.map(mole => 
        mole.id === moleId && mole.isUp
          ? { ...mole, isUp: false, timeUp: 0 }
          : mole
      )
    );
    
    const newScore = score + 10;
    setScore(newScore);
    onScoreChange(newScore);
  }, [score, onScoreChange]);

  return (
    <group>
      {/* Ground plane */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Moles */}
      {moles.map(mole => (
        <Mole
          key={mole.id}
          position={mole.position}
          isUp={mole.isUp}
          onHit={() => handleMoleHit(mole.id)}
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
    </group>
  );
};

export default GameBoard;