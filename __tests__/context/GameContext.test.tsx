import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GameProvider, useGameContext } from '../../app/context/GameContext';

global.fetch = jest.fn();

global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  loop: false,
  currentTime: 0,
}));

const TestComponent = () => {
  const { 
    userName, 
    setUserName, 
    isStarted, 
    startGame,
    isCompleted,
    setIsCompleted,
    resetGame
  } = useGameContext();
  
  return (
    <div>
      <div data-testid="user-name">{userName}</div>
      <button 
        data-testid="set-user-name" 
        onClick={() => setUserName('Test User')}
      >
        Set Name
      </button>
      <button 
        data-testid="start-game" 
        onClick={() => {
          setUserName('Test User');
          startGame();
        }}
      >
        Start Game
      </button>
      <button 
        data-testid="complete-game" 
        onClick={() => setIsCompleted(true)}
      >
        Complete Game
      </button>
      <button 
        data-testid="reset-game" 
        onClick={resetGame}
      >
        Reset Game
      </button>
      <div data-testid="game-status">
        {isStarted ? 'Game Started' : 'Game Not Started'}
        {isCompleted ? ' - Game Completed' : ''}
      </div>
    </div>
  );
};

describe('GameContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        json: () => Promise.resolve({ results: [] })
      })
    );
  });

  it('provides default values', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    expect(screen.getByTestId('user-name').textContent).toBe('');
    expect(screen.getByTestId('game-status').textContent).toBe('Game Not Started');
  });

  it('allows updating user name', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    act(() => {
      screen.getByTestId('set-user-name').click();
    });
    
    expect(screen.getByTestId('user-name').textContent).toBe('Test User');
  });

  it('allows starting the game', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    act(() => {
      screen.getByTestId('set-user-name').click();
    });
    
    act(() => {
      screen.getByTestId('start-game').click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('game-status').textContent).toBe('Game Started');
    });
  });

  it('allows completing the game', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    act(() => {
      screen.getByTestId('set-user-name').click();
    });
    
    act(() => {
      screen.getByTestId('start-game').click();
    });
    
    act(() => {
      screen.getByTestId('complete-game').click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('game-status').textContent).toBe('Game Started - Game Completed');
    });
  });

  it('allows resetting the game', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    act(() => {
      screen.getByTestId('set-user-name').click();
    });
    
    act(() => {
      screen.getByTestId('start-game').click();
    });
    
    act(() => {
      screen.getByTestId('complete-game').click();
    });
    
    act(() => {
      screen.getByTestId('reset-game').click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('game-status').textContent).toBe('Game Not Started');
    });
  });

  it('initializes audio elements', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );
    
    expect(global.Audio).toHaveBeenCalledTimes(2);
    expect(global.Audio).toHaveBeenCalledWith('./bgm.mp3');
    expect(global.Audio).toHaveBeenCalledWith('./sound/shot.mp3');
  });
});
