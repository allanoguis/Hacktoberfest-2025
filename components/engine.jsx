"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import gojiraImage from "@/assets/images/game/gojirav3.svg";
import obstacleImage from "@/assets/images/game/tank.svg";
import cloud1Image from "@/assets/images/game/cloud1.png";
import cloud2Image from "@/assets/images/game/cloud2.png";
import cloud3Image from "@/assets/images/game/cloud3.png";
import { saveGame } from "@/lib/api-client";
import { useUser } from "@clerk/nextjs";

// Constants
const GAME_HEIGHT = 600;
const GAME_WIDTH = 1000;
const GAME_SPEED = 10;

const GOJIRA_WIDTH = 150;
const GOJIRA_HEIGHT = 150;
const GROUND = 0; // Gojira's feet position

const SPAWN_POINT = 20; // Set spawn point for Gojira
const JUMP_HEIGHT = 350;
const jumpDuration = 260; // Total duration of the jump
const jumpInterval = 20; // Interval for updating the jump height

const OBSTACLE_WIDTH = 100;
const OBSTACLE_HEIGHT = 50;

const CLOUD1_WIDTH = 150; // Cloud1 width
const CLOUD1_HEIGHT = 50; // Cloud1 height
const CLOUD1_SPEED = 2.74; // Cloud1 speed
const CLOUD1_Y = GAME_HEIGHT / 2.5 - CLOUD1_HEIGHT;

const CLOUD2_WIDTH = 280;
const CLOUD2_HEIGHT = 54;
const CLOUD2_SPEED = 2;
const CLOUD2_Y = GAME_HEIGHT / 5 - CLOUD2_HEIGHT;

const CLOUD3_WIDTH = 170;
const CLOUD3_HEIGHT = 60;
const CLOUD3_SPEED = 1;
const CLOUD3_Y = GAME_HEIGHT / 3 - CLOUD3_HEIGHT;

export default function Engine() {
  // State variables for UI rendering
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [ground, setGround] = useState(GROUND);
  const [jumping, setJumping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Refs for high-frequency game logic (avoids re-renders)
  const obstacleRef = useRef(GAME_WIDTH);
  const cloud1Ref = useRef(GAME_WIDTH);
  const cloud2Ref = useRef(GAME_WIDTH);
  const cloud3Ref = useRef(GAME_WIDTH);
  const scoreRef = useRef(0);
  const isSavingRef = useRef(false);
  const groundRef = useRef(GROUND);

  const { isLoaded, isSignedIn, user } = useUser();

  // Audio/Image Refs
  const canvasRef = useRef(null);
  const gojiraImgRef = useRef(null);
  const obstacleImgRef = useRef(null);
  const cloud1ImgRef = useRef(null);
  const cloud2ImgRef = useRef(null);
  const cloud3ImgRef = useRef(null);
  const gameLoopRef = useRef(null);

  const saveGameFromFrontend = useCallback(
    async (finalScore) => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      try {
        // Fetch the public IP address
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;

        // Detect user device/browser info
        const userAgent = navigator.userAgent;
        const isBrave = !!navigator.brave;
        const isEdge = /Edg/.test(userAgent);
        const isChrome =
          /Chrome/.test(userAgent) &&
          !isEdge &&
          !isBrave &&
          !/OPR/.test(userAgent);
        const isFirefox = /Firefox/.test(userAgent);
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
        const isOpera = /OPR/.test(userAgent);

        // Handle Guest vs Signed In
        const playerID = isLoaded && isSignedIn && user ? user.id : "000000";
        const fullname = isLoaded && isSignedIn && user ? user.fullName : "Guest";

        let browserName = "Unknown Browser";
        if (isBrave) browserName = "Brave";
        else if (isEdge) browserName = "Microsoft Edge";
        else if (isChrome) browserName = "Chrome";
        else if (isFirefox) browserName = "Firefox";
        else if (isSafari) browserName = "Safari";
        else if (isOpera) browserName = "Opera";

        const data = {
          player: playerID,
          playerName: fullname,
          score: finalScore,
          time: new Date(),
          ipAddress: ipAddress,
          deviceType: browserName,
          userAgent: userAgent,
        };

        await saveGame(data);
        console.log("Game saved successfully:", data);
      } catch (error) {
        console.error("Error saving game data:", error);
      } finally {
        // We don't reset isSaving here directly to prevent multiple attempts 
        // until a new game starts.
      }
    },
    [isLoaded, isSignedIn, user]
  );

  // Jump function
  const jump = useCallback(() => {
    if (!jumping && !gameOver) {
      setJumping(true);
      let jumpHeight = 0;

      const jumpUp = setInterval(() => {
        if (jumpHeight < JUMP_HEIGHT) {
          jumpHeight += JUMP_HEIGHT / (jumpDuration / jumpInterval);
          setGround(jumpHeight);
          groundRef.current = jumpHeight;
        } else {
          clearInterval(jumpUp);
          const fallDown = setInterval(() => {
            if (jumpHeight > GROUND) {
              jumpHeight -= JUMP_HEIGHT / (jumpDuration / jumpInterval);
              setGround(jumpHeight);
              groundRef.current = jumpHeight;
            } else {
              clearInterval(fallDown);
              setJumping(false);
              setGround(GROUND);
              groundRef.current = GROUND;
            }
          }, jumpInterval);
        }
      }, jumpInterval);
    }
  }, [jumping, gameOver]);

  // Handle input
  const handleInput = useCallback(
    (event) => {
      const allowedKeys = ["Space", "ArrowUp"];
      const isJumpKey =
        allowedKeys.includes(event.code) ||
        event.type === "click" ||
        event.type === "touchstart";

      // Only allow jumping if the game is running and not over
      if (gameStarted && !gameOver && isJumpKey) {
        if (event.cancelable) event.preventDefault();
        jump();
      }
    },
    [gameStarted, gameOver, jump]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleInput);
    document.addEventListener("click", handleInput);
    document.addEventListener("touchstart", handleInput, { passive: false });
    return () => {
      document.removeEventListener("keydown", handleInput);
      document.removeEventListener("click", handleInput);
      document.removeEventListener("touchstart", handleInput);
    };
  }, [handleInput]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;

    const loadImage = (ref, src) => {
      if (typeof Image !== "undefined" && !ref.current) {
        ref.current = new Image();
        ref.current.src = src;
      }
    };

    loadImage(gojiraImgRef, gojiraImage.src);
    loadImage(obstacleImgRef, obstacleImage.src);
    loadImage(cloud1ImgRef, cloud1Image.src);
    loadImage(cloud2ImgRef, cloud2Image.src);
    loadImage(cloud3ImgRef, cloud3Image.src);

    const draw = () => {
      context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Gojira
      if (gojiraImgRef.current) {
        context.drawImage(
          gojiraImgRef.current,
          SPAWN_POINT,
          GAME_HEIGHT - groundRef.current - GOJIRA_HEIGHT,
          GOJIRA_WIDTH,
          GOJIRA_HEIGHT
        );
      }

      // Obstacle
      if (obstacleImgRef.current) {
        context.drawImage(
          obstacleImgRef.current,
          obstacleRef.current,
          GAME_HEIGHT - OBSTACLE_HEIGHT,
          OBSTACLE_WIDTH,
          OBSTACLE_HEIGHT
        );
      }

      // Clouds
      if (cloud1ImgRef.current) {
        context.drawImage(cloud1ImgRef.current, cloud1Ref.current, CLOUD1_Y, CLOUD1_WIDTH, CLOUD1_HEIGHT);
      }
      if (cloud2ImgRef.current) {
        context.drawImage(cloud2ImgRef.current, cloud2Ref.current, CLOUD2_Y, CLOUD2_WIDTH, CLOUD2_HEIGHT);
      }
      if (cloud3ImgRef.current) {
        context.drawImage(cloud3ImgRef.current, cloud3Ref.current, CLOUD3_Y, CLOUD3_WIDTH, CLOUD3_HEIGHT);
      }
    };

    const isColliding = () => {
      const gojiraRect = {
        left: SPAWN_POINT + 20, // Add padding for better hitbox
        right: SPAWN_POINT + GOJIRA_WIDTH - 20,
        top: GAME_HEIGHT - groundRef.current - GOJIRA_HEIGHT + 20,
        bottom: GAME_HEIGHT - groundRef.current - 10,
      };

      const obstacleRect = {
        left: obstacleRef.current + 10,
        right: obstacleRef.current + OBSTACLE_WIDTH - 10,
        top: GAME_HEIGHT - OBSTACLE_HEIGHT + 10,
        bottom: GAME_HEIGHT,
      };

      return !(
        gojiraRect.right < obstacleRect.left ||
        gojiraRect.left > obstacleRect.right ||
        gojiraRect.bottom < obstacleRect.top ||
        gojiraRect.top > obstacleRect.bottom
      );
    };

    const gameLoop = () => {
      if (isColliding()) {
        setGameOver(true);
        setGameStarted(false);
        saveGameFromFrontend(scoreRef.current);
        return;
      }

      // Move Entities
      obstacleRef.current -= GAME_SPEED;
      if (obstacleRef.current <= -OBSTACLE_WIDTH) obstacleRef.current = GAME_WIDTH;

      cloud1Ref.current -= CLOUD1_SPEED;
      if (cloud1Ref.current <= -CLOUD1_WIDTH) cloud1Ref.current = GAME_WIDTH;

      cloud2Ref.current -= CLOUD2_SPEED;
      if (cloud2Ref.current <= -CLOUD2_WIDTH) cloud2Ref.current = GAME_WIDTH;

      cloud3Ref.current -= CLOUD3_SPEED;
      if (cloud3Ref.current <= -CLOUD3_WIDTH) cloud3Ref.current = GAME_WIDTH;

      // Update Score
      scoreRef.current += 1;
      if (scoreRef.current % 10 === 0) {
        setScore(scoreRef.current);
      }

      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameStarted && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      draw(); // Draw final state
    }

    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameStarted, gameOver, saveGameFromFrontend]);

  const handleStartGame = () => {
    // If resetting from Game Over, just clean up and show the Start screen
    if (gameOver) {
      isSavingRef.current = false;
      scoreRef.current = 0;
      obstacleRef.current = GAME_WIDTH;
      cloud1Ref.current = GAME_WIDTH;
      cloud2Ref.current = GAME_WIDTH;
      cloud3Ref.current = GAME_WIDTH;
      groundRef.current = GROUND;

      setScore(0);
      setGround(GROUND);
      setGameOver(false);
      setGameStarted(false);
      return;
    }

    // If starting from the Idle screen, just set started to true
    setGameStarted(true);
  };

  const handleManualSave = async () => {
    if (score === 0 || isSaving) return;
    setIsSaving(true);
    setSaveMessage("");
    try {
      await saveGameFromFrontend(score);
      setSaveMessage("SAVED!");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch (error) {
      setSaveMessage("ERROR");
      setTimeout(() => setSaveMessage(""), 2000);
    } finally {
      setIsSaving(false);
      isSavingRef.current = false; // Reset the ref to allow future saves
    }
  };

  const GameOverMessage = () => (
    <div className="flex flex-col items-center gap-2 md:gap-4">
      <span className="text-2xl md:text-4xl text-primary font-bold uppercase antialiased tracking-widest text-center">
        G A M E   O V E R
      </span>
      <span className="text-lg md:text-xl">Final Score: {score}</span>
    </div>
  );

  const StartGameButton = ({ onClick, isGameOver }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="px-6 md:px-8 py-2 md:py-3 bg-primary text-secondary font-bold text-lg md:text-xl rounded-full hover:scale-105 transition-transform animate-pulse antialiased shadow-lg whitespace-nowrap"
    >
      {isGameOver ? "R E S T A R T" : "S T A R T   G A M E"}
    </button>
  );

  return (
    <div className="flex flex-col relative w-full min-h-screen p-4 lg:p-11 text-primary justify-center items-center select-none font-space overscroll-none">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full max-w-[1000px] gap-4 px-2 py-2">
        <div className="flex justify-center gap-4 md:gap-8 text-[10px] md:text-sm font-medium text-primary/60 uppercase tracking-widest antialiased">
          <div className="hidden md:flex items-center gap-2">
            <kbd className="px-2 py-1 bg-primary/10 rounded border border-primary/20 font-sans">SPACE</kbd>
            <span>JUMP</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-primary/10 rounded border border-primary/20 font-sans">TAP</kbd>
            <span className="hidden md:inline">JUMP</span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex flex-col items-end">
            <span className="font-mono text-lg md:text-xl bg-primary/10 px-4 py-1 rounded-md">
              {score.toString().padStart(6, '0')}
            </span>
            {saveMessage && (
              <span className="text-[10px] font-bold text-primary animate-pulse absolute -bottom-4">
                {saveMessage}
              </span>
            )}
          </div>
          <button
            onClick={handleManualSave}
            disabled={isSaving || score === 0}
            className="px-3 md:px-4 py-1 bg-primary text-secondary text-sm md:text-xl font-bold rounded-md hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 antialiased shadow-sm whitespace-nowrap"
          >
            {isSaving ? "SAVING..." : "SAVE SCORE"}
          </button>
        </div>
      </div>

      <div className="relative group rounded-xl overflow-hidden shadow-2xl touch-none">
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="w-full max-w-[1000px] h-auto aspect-[5/3] rounded-xl object-contain bg-gradient-to-b from-blue-400 to-orange-400 dark:from-blue-900 dark:to-orange-900 shadow-2xl"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center transition-all duration-500">
          {(gameOver || !gameStarted) && (
            <div className="bg-background/80 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-2xl border border-primary/20 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300 mx-4">
              {gameOver && <GameOverMessage />}
              <StartGameButton onClick={handleStartGame} isGameOver={gameOver} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
