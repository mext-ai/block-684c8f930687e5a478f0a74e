import React from 'react';

interface GameUIProps {
  score: number;
  timeLeft: number;
  gameState: 'waiting' | 'playing' | 'finished';
  onStartGame: () => void;
  onRestartGame: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ 
  score, 
  timeLeft, 
  gameState, 
  onStartGame, 
  onRestartGame 
}) => {
  const uiStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    zIndex: 100,
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    pointerEvents: 'none'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    pointerEvents: 'auto',
    transition: 'all 0.3s ease'
  };

  const buttonHoverStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#45a049',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
    color: '#FFD700'
  };

  const instructionStyle: React.CSSProperties = {
    fontSize: '18px',
    marginBottom: '30px',
    maxWidth: '400px',
    lineHeight: '1.5'
  };

  if (gameState === 'waiting') {
    return (
      <div style={overlayStyle}>
        <h1 style={titleStyle}>🔨 Whack-a-Mole 3D</h1>
        <p style={instructionStyle}>
          Click on the moles as they pop up from their holes!<br/>
          You have 30 seconds to get the highest score possible.<br/>
          Each mole is worth 10 points.
        </p>
        <button 
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          onClick={onStartGame}
        >
          Start Game
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div style={overlayStyle}>
        <h1 style={titleStyle}>Game Over!</h1>
        <p style={{ fontSize: '32px', marginBottom: '20px', color: '#FFD700' }}>
          Final Score: {score}
        </p>
        <p style={instructionStyle}>
          {score >= 100 ? "Amazing! You're a mole-whacking master! 🏆" :
           score >= 50 ? "Great job! You've got good reflexes! 🎯" :
           "Good try! Practice makes perfect! 💪"}
        </p>
        <button 
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          onClick={onRestartGame}
        >
          Play Again
        </button>
      </div>
    );
  }

  // Playing state - show HUD
  return (
    <div style={uiStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '24px' }}>
          Score: <span style={{ color: '#FFD700' }}>{score}</span>
        </div>
        <div style={{ fontSize: '24px' }}>
          Time: <span style={{ color: timeLeft <= 10 ? '#FF4444' : '#FFD700' }}>{timeLeft}s</span>
        </div>
      </div>
      {timeLeft <= 10 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '10px', 
          fontSize: '20px', 
          color: '#FF4444',
          animation: 'pulse 1s infinite' 
        }}>
          Hurry up! ⏰
        </div>
      )}
    </div>
  );
};

export default GameUI;