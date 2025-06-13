import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GameBoard from './GameBoard';
import GameUI from './GameUI';

interface BlockProps {
  title?: string;
  description?: string;
}

const Block: React.FC<BlockProps> = ({ title, description }) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Send completion event when game ends
  useEffect(() => {
    if (gameState === 'finished') {
      const timeSpent = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 30;
      
      // Send completion event to parent
      const completionData = {
        type: 'BLOCK_COMPLETION',
        blockId: '684c8f930687e5a478f0a74e',
        completed: true,
        score: score,
        maxScore: 300, // Theoretical max (30 seconds * 10 points per second if perfect)
        timeSpent: timeSpent,
        data: {
          finalScore: score,
          gameType: 'whack-a-mole',
          accuracy: score > 0 ? Math.min(score / 200, 1) : 0 // Estimate accuracy
        }
      };

      window.postMessage(completionData, '*');
      window.parent.postMessage(completionData, '*');
    }
  }, [gameState, score, gameStartTime]);

  // Update time left during game
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  const handleStartGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setGameStartTime(Date.now());
  }, []);

  const handleRestartGame = useCallback(() => {
    setGameState('waiting');
    setScore(0);
    setTimeLeft(30);
    setGameStartTime(null);
  }, []);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleGameEnd = useCallback(() => {
    setGameState('finished');
  }, []);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%)',
    overflow: 'hidden',
    cursor: gameState === 'playing' ? 'crosshair' : 'default'
  };

  return (
    <div style={containerStyle}>
      {/* Game UI Overlay */}
      <GameUI
        score={score}
        timeLeft={timeLeft}
        gameState={gameState}
        onStartGame={handleStartGame}
        onRestartGame={handleRestartGame}
      />

      {/* 3D Scene */}
      <Canvas
        camera={{ 
          position: [0, 8, 8], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
      >
        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={6}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, 0, 0]}
        />

        {/* Game Board with Moles */}
        <GameBoard
          onScoreChange={handleScoreChange}
          gameActive={gameState === 'playing'}
          onGameEnd={handleGameEnd}
        />

        {/* Additional Scene Elements */}
        <fog attach="fog" args={['#87CEEB', 10, 25]} />
        
        {/* Ambient lighting */}
        <ambientLight intensity={0.6} />
        
        {/* Sun light */}
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Fill light */}
        <pointLight position={[-5, 10, -5]} intensity={0.4} />
      </Canvas>

      {/* Game Instructions */}
      {gameState === 'playing' && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '16px',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '10px 20px',
          borderRadius: '10px',
          zIndex: 50
        }}>
          Click the moles when they pop up! 🔨 Drag to rotate camera | Scroll to zoom
        </div>
      )}

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Block;