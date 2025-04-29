// PicklePong React Game App
// Created for: https://github.com/mdatre1/PicklePong
// Description included in-game as requested

import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const App = () => {
  const canvasRef = useRef(null);
  const [playerY, setPlayerY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [aiY, setAiY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ball, setBall] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 4, vy: 4 });
  const [score, setScore] = useState({ player: 0, ai: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pickleImg = new Image();
    pickleImg.src = '/pickle-paddle.png';
    const oliveImg = new Image();
    oliveImg.src = '/olive-ball.png';
    const bounceSound = new Audio('/bounce.wav');

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(pickleImg, 0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.drawImage(pickleImg, CANVAS_WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.drawImage(oliveImg, ball.x, ball.y, BALL_SIZE, BALL_SIZE);
    };

    const update = () => {
      let newBall = { ...ball };
      newBall.x += newBall.vx;
      newBall.y += newBall.vy;

      if (newBall.y <= 0 || newBall.y + BALL_SIZE >= CANVAS_HEIGHT) {
        newBall.vy *= -1;
        bounceSound.play();
      }

      if (
        newBall.x <= PADDLE_WIDTH &&
        newBall.y + BALL_SIZE >= playerY &&
        newBall.y <= playerY + PADDLE_HEIGHT
      ) {
        newBall.vx *= -1;
        bounceSound.play();
      }

      if (
        newBall.x + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH &&
        newBall.y + BALL_SIZE >= aiY &&
        newBall.y <= aiY + PADDLE_HEIGHT
      ) {
        newBall.vx *= -1;
        bounceSound.play();
      }

      if (newBall.x < 0) {
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
        newBall = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: 4, vy: 4 };
      }

      if (newBall.x > CANVAS_WIDTH) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        newBall = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: -4, vy: 4 };
      }

      const targetY = newBall.y - PADDLE_HEIGHT / 2;
      setAiY(prev => prev + (targetY - prev) * 0.05);
      setBall(newBall);
    };

    const gameLoop = () => {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    };

    pickleImg.onload = oliveImg.onload = () => gameLoop();
  }, [ball, playerY]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top - PADDLE_HEIGHT / 2;
    setPlayerY(Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, y)));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowUp') setPlayerY(y => Math.max(0, y - 20));
      else if (e.key === 'ArrowDown') setPlayerY(y => Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, y + 20));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="game-container">
      <h1>🎮 Picklepong: Retro Rallies, Fresh Spin 🏓🥒</h1>
      <p className="description">
        Crank up the 8-bit tunes and dust off your tube socks—Picklepong is here to serve that groovy '70s arcade energy with a tangy twist.
        Inspired by the legendary Pong, this game brings pixel-perfect paddle play into the now, blending the minimalist charm of the original with a juicy splash of pickleball chaos.
        Whether you're reliving the glory days or discovering the magic of paddle battles for the first time, Picklepong’s neon-soaked nostalgia, chunky sound effects, and no-frills fun will have you hooked faster than you can say “Atari who?”
        One part pong, one part pickleball, all parts awesome. Serve it. Slam it. Relive it. This is Picklepong.
      </p>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
      />
      <div className="scoreboard">
        <span>Player: {score.player}</span>
        <span>AI: {score.ai}</span>
      </div>
    </div>
  );
};

export default App;
