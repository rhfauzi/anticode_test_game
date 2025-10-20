"use client";
import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 6;
const TOTAL_TIME = 60;

export default function TileGame() {
	const [gameState, setGameState] = useState("idle");
	const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
	const [score, setScore] = useState(0);
	const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
	const [targetPosition, setTargetPosition] = useState({ x: 4, y: 4 });

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Generate random position
	const generateRandomPosition = useCallback(() => {
		return {
			x: Math.floor(Math.random() * GRID_SIZE),
			y: Math.floor(Math.random() * GRID_SIZE),
		};
	}, []);

	const startGame = () => {
		setGameState("playing");
		setTimeLeft(TOTAL_TIME);
		setScore(0);
		setPlayerPosition({ x: 0, y: 0 });
		setTargetPosition(generateRandomPosition());
	};

	// Fungsi untuk menggerakkan player / set new player position
	const movePlayer = useCallback(
		(x: number, y: number) => {
			if (gameState === "playing") {
				const newX = Math.max(0, Math.min(GRID_SIZE - 1, playerPosition.x + x));
				const newY = Math.max(0, Math.min(GRID_SIZE - 1, playerPosition.y + y));

				const newPos = { x: newX, y: newY };

				// Check if player reached target
				if (newX === targetPosition.x && newY === targetPosition.y) {
					setScore((prev) => prev + 1);
					setTargetPosition(generateRandomPosition());
				}

				// Update player position
				setPlayerPosition(newPos);
			}
		},
		[gameState, playerPosition, targetPosition, generateRandomPosition]
	);

	// Fungsi untuk menggerakkan player dengan keyboard arrow
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					movePlayer(0, -1);
					break;
				case "ArrowDown":
					e.preventDefault();
					movePlayer(0, 1);
					break;
				case "ArrowLeft":
					e.preventDefault();
					movePlayer(-1, 0);
					break;
				case "ArrowRight":
					e.preventDefault();
					movePlayer(1, 0);
					break;
				case " ":
					e.preventDefault();
					if (gameState === "idle" || gameState === "finished") {
						startGame();
					}
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [movePlayer, gameState]);

	// Timer
	useEffect(() => {
		let interval: any;
		if (gameState === "playing" && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setGameState("finished");
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [gameState, timeLeft]);

	// Start the game on mount
	useEffect(() => {
		startGame();
	}, []);

	return (
		<div className="h-screen flex items-center justify-center">
			<div className="bg-red-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
				{/* Game Grid - 6x6 */}
				<div className="grid grid-cols-6 gap-0 mb-3">
					{Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
						const x = index % GRID_SIZE;
						const y = Math.floor(index / GRID_SIZE);
						const isPlayer = x === playerPosition.x && y === playerPosition.y;
						const isTarget = x === targetPosition.x && y === targetPosition.y;

						let bgColor = "bg-white";
						if (isPlayer) {
							bgColor = "bg-blue-500";
						} else if (isTarget) {
							bgColor = "bg-yellow-500";
						}

						return (
							<div
								key={index}
								className={`aspect-square border-2 border-black ${bgColor}`}
							/>
						);
					})}
				</div>

				{/* Timer and Score */}
				<div className="flex justify-between items-center mb-4">
					<div className="text-2xl font-mono font-bold text-stone-50">
						{formatTime(timeLeft)}
					</div>
					<div className="text-2xl font-mono font-bold text-stone-50">
						Total: {score}
					</div>
				</div>
			</div>
		</div>
	);
}
