"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import gojiraImage from "@/app/images/gojirav3.svg";
import obstacleImage from "@/app/images/tank.svg";
import cloud1Image from "@/app/images/cloud1.png";
import cloud2Image from "@/app/images/cloud2.png";
import cloud3Image from "@/app/images/cloud3.png";
import { saveGame } from "../services/saveGameAPI/route";
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
  // State variables
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [ground, setGround] = useState(GROUND);
  const [obstacle, setObstacle] = useState(GAME_WIDTH); // Spawn point of the obstacle
  const [cloud1, setCloud1] = useState(GAME_WIDTH); // Spawn point of the cloud1
  const [cloud2, setCloud2] = useState(GAME_WIDTH); // Spawn point of the cloud2
  const [cloud3, setCloud3] = useState(GAME_WIDTH); // cloud3
  const [score, setScore] = useState(0);
  const [jumping, setJumping] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser(); // Use Clerk's useUser hook to detect sign-in

  // Refs
  const canvasRef = useRef(null);
  const gojiraImgRef = useRef(null);
  const obstacleImgRef = useRef(null);
  const cloud1ImgRef = useRef(null);
  const cloud2ImgRef = useRef(null);
  const cloud3ImgRef = useRef(null);
  const gameLoopRef = useRef(null); // Ref to store the game loop

  // Jump function
  const jump = useCallback(() => {
    if (!jumping && !gameOver) {
      setJumping(true);
      let jumpHeight = 0;

      const jumpUp = setInterval(() => {
        if (jumpHeight < JUMP_HEIGHT) {
          jumpHeight += JUMP_HEIGHT / (jumpDuration / jumpInterval);
          setGround(jumpHeight);
        } else {
          clearInterval(jumpUp);
          const fallDown = setInterval(() => {
            if (jumpHeight > GROUND) {
              jumpHeight -= JUMP_HEIGHT / (jumpDuration / jumpInterval);
              setGround(jumpHeight);
            } else {
              clearInterval(fallDown);
              setJumping(false);
              setGround(GROUND);
            }
          }, jumpInterval);
        }
      }, jumpInterval);
    }
  }, [jumping, gameOver]);

  // Handle key press
  const handleInput = useCallback(
    (event) => {
      const allowedKeys = [
        "Space",
        "ArrowRight",
        "ArrowUp",
        "ArrowLeft",
        "ArrowDown",
      ];
      if (!gameStarted) {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
      } else if (allowedKeys.includes(event.code) || event.type === "click") {
        jump();
      }
    },
    [gameStarted, jump]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleInput);
    document.addEventListener("click", handleInput);
    return () => {
      document.removeEventListener("keydown", handleInput);
      document.removeEventListener("click", handleInput);
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
        ref.current.onload = () => setScore(0); // check if the assets are loaded then reset the score
      }
    };

    loadImage(gojiraImgRef, gojiraImage.src); // Load Gojira image
    loadImage(obstacleImgRef, obstacleImage.src); // Load obstacle image
    loadImage(cloud1ImgRef, cloud1Image.src); // Load cloud1 image
    loadImage(cloud2ImgRef, cloud2Image.src); // Load cloud 2 image
    loadImage(cloud3ImgRef, cloud3Image.src); // Load cloud3

    const draw = (context) => {
      context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      context.drawImage(
        gojiraImgRef.current,
        SPAWN_POINT,
        GAME_HEIGHT - (jumping ? JUMP_HEIGHT : ground) - GOJIRA_HEIGHT,
        GOJIRA_WIDTH,
        GOJIRA_HEIGHT
      );
      if (obstacleImgRef.current) {
        context.drawImage(
          obstacleImgRef.current,
          obstacle,
          GAME_HEIGHT - OBSTACLE_HEIGHT,
          OBSTACLE_WIDTH,
          OBSTACLE_HEIGHT
        );
      }
      if (cloud1ImgRef.current) {
        context.drawImage(
          cloud1ImgRef.current,
          cloud1,
          CLOUD1_Y,
          CLOUD1_WIDTH,
          CLOUD1_HEIGHT
        ); // Draw cloud1
      }
      if (cloud2ImgRef.current) {
        context.drawImage(
          cloud2ImgRef.current,
          cloud2,
          CLOUD2_Y,
          CLOUD2_WIDTH,
          CLOUD2_HEIGHT
        );
      }
      if (cloud3ImgRef.current) {
        context.drawImage(
          cloud3ImgRef.current,
          cloud3,
          CLOUD3_Y,
          CLOUD3_WIDTH,
          CLOUD3_HEIGHT
        );
      }
    };

    const isColliding = () => {
      const gojiraRect = {
        left: SPAWN_POINT,
        right: SPAWN_POINT + GOJIRA_WIDTH,
        top: GAME_HEIGHT - (jumping ? JUMP_HEIGHT : ground) - GOJIRA_HEIGHT,
        bottom: GAME_HEIGHT - (jumping ? JUMP_HEIGHT : ground),
      };

      const obstacleRect = {
        left: obstacle,
        right: obstacle + OBSTACLE_WIDTH,
        top: GAME_HEIGHT - OBSTACLE_HEIGHT,
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
      setObstacle((prevLeft) => {
        if (prevLeft <= -OBSTACLE_WIDTH) {
          return GAME_WIDTH;
        }
        return prevLeft - GAME_SPEED;
      });

      setCloud1((prevLeft) => {
        if (prevLeft <= -CLOUD1_WIDTH) {
          return GAME_WIDTH;
        }
        return prevLeft - CLOUD1_SPEED;
      });

      setCloud2((prevLeft) => {
        if (prevLeft <= -CLOUD2_WIDTH) {
          return GAME_WIDTH;
        }
        return prevLeft - CLOUD2_SPEED;
      });

      setCloud3((prevLeft) => {
        if (prevLeft <= -CLOUD3_WIDTH) {
          return GAME_WIDTH;
        }
        return prevLeft - CLOUD3_SPEED;
      });

      setScore((prevScore) => prevScore + 1);

      if (isColliding()) {
        clearInterval(gameLoopRef.current);
        setObstacle(GAME_WIDTH);
        setGameOver(true);
        setGameStarted(false);
      }

      draw(context);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameStarted && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameStarted, gameOver, obstacle, ground, cloud1, cloud2, cloud3, jumping]);

  useEffect(() => {
    // Retrieve score from localStorage when the component mounts
    const savedScore = localStorage.getItem("savedScore");
    if (savedScore && !gameOver) {
      // Check if game is not over
      setScore(Number(savedScore)); // Set the score if it exists
    } else {
      setScore(0); // Reset score to 0 if game is over or no saved score
    }
  }, [gameOver]);

  useEffect(() => {
    // Save the score to localStorage whenever it changes
    localStorage.setItem("savedScore", score.toString());
    if (gameOver) {
      saveGameFromFrontend();
    }
  }, [score, gameOver, saveGameFromFrontend]); // Run whenever score changes

  const saveGameFromFrontend = useCallback(async () => {
    try {
      // Fetch the public IP address
      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip;

      const currentTime = new Date();

      // Detect user device/browser info
      const userAgent = navigator.userAgent;
      const isBrave = !!navigator.brave; // Detect Brave browser
      const isEdge = /Edg/.test(userAgent); // Detect Microsoft Edge
      const isChrome =
        /Chrome/.test(userAgent) &&
        !isEdge &&
        !isBrave &&
        !/OPR/.test(userAgent);
      const isFirefox = /Firefox/.test(userAgent);
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
      const isOpera = /OPR/.test(userAgent);
      const playerID = isLoaded && isSignedIn && user ? user.id : "000000";
      const fullname = isLoaded && isSignedIn && user ? user.fullName : "Guest";

      let browserName = "Unknown Browser";
      if (isBrave) {
        browserName = "Brave";
      } else if (isEdge) {
        browserName = "Microsoft Edge";
      } else if (isChrome) {
        browserName = "Chrome";
      } else if (isFirefox) {
        browserName = "Firefox";
      } else if (isSafari) {
        browserName = "Safari";
      } else if (isOpera) {
        browserName = "Opera";
      }

      // Call the saveGame API with extended payload
      const data = {
        player: playerID,
        playerName: fullname,
        score: score,
        time: currentTime,
        ipAddress: ipAddress,
        deviceType: browserName,
        userAgent: userAgent,
      };
      await saveGame(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching IP or saving game data:", error);
    }
  }, [isLoaded, isSignedIn, user, score]);

  const GameOverMessage = () => (
    <span className="text-2xl text-primary font-semibold uppercase antialiased">
      G A M E O V E R
    </span>
  );

  const StartGameButton = ({ onClick, isGameOver }) => (
    <span className="flex flex-col">
      <button
        onClick={onClick}
        className="text-primary font-semibold animate-pulse antialiased"
      >
        {isGameOver ? "R E S T A R T" : "S T A R T   G A M E"}
      </button>
    </span>
  );

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacle(GAME_WIDTH); // Reset obstacle position when the game starts
    setCloud1(GAME_WIDTH); // Reset cloud1 position when the game starts
    setCloud2(GAME_WIDTH);
    setCloud3(GAME_WIDTH);
  };
  return (
    <>
      <div className="grid relative w-full p-11 text-primary justify-center items-center">
        <span className="font-semibold text-center">Score: {score}</span>
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="border border-white bg-gradient-to-b from-blue-400 to-orange-400"
        />
        <div className="absolute flex flex-col justify-center items-center">
          {gameOver && <GameOverMessage />}
          {!gameStarted && (
            <StartGameButton onClick={handleStartGame} isGameOver={gameOver} />
          )}
        </div>
        <div className="mt-4 text-sm text-primary text-center antialiased">
          press space key to jump
        </div>
      </div>
    </>
  );
}
