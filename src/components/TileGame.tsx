"use client";
import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 6;
const TOTAL_TIME = 60;
const BLOCKED_GRID = ["1,1", "1,2", "1,4", "2,1", "3,1", "4,1", "4,3", "4,4"];

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
	const generateRandomPosition = () => {
		const newPosition = {
			x: Math.floor(Math.random() * GRID_SIZE),
			y: Math.floor(Math.random() * GRID_SIZE),
		};

		const isBlocked = isPositionBlocked(newPosition.x, newPosition.y);

		if (!isBlocked) {
			return newPosition;
		} else {
			return generateRandomPosition();
		}
	};

	const startGame = () => {
		setGameState("playing");
		setTimeLeft(TOTAL_TIME);
		setScore(0);
		setPlayerPosition({ x: 0, y: 0 });
		setTargetPosition(generateRandomPosition());
	};

	// Fungsi untuk menggerakkan player / set new player position
	const movePlayer = (x: number, y: number) => {
		if (gameState === "playing") {
			const newX = Math.max(0, Math.min(GRID_SIZE - 1, playerPosition.x + x));
			const newY = Math.max(0, Math.min(GRID_SIZE - 1, playerPosition.y + y));

			const newPos = { x: newX, y: newY };

			// Check if the target position is blocked
			if (!isPositionBlocked(newX, newY)) {
				// Check if player reached target
				if (newX === targetPosition.x && newY === targetPosition.y) {
					setScore((prev) => prev + 1);
					setTargetPosition(generateRandomPosition());
				}

				// Update player position
				setPlayerPosition(newPos);
			}
		}
	};

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

	// Check if a position is blocked
	const isPositionBlocked = useCallback((x: number, y: number) => {
		return BLOCKED_GRID.includes(`${x},${y}`);
	}, []);

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
		<div className="h-screen flex items-center justify-center relative ">
			<div className="bg-red-900 rounded-2xl p-6 max-w-sm w-full">
				{/* Game Grid - 6x6 */}
				<div className="grid grid-cols-6 gap-0 mb-3">
					{Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
						const x = index % GRID_SIZE;
						const y = Math.floor(index / GRID_SIZE);
						const isPlayer = x === playerPosition.x && y === playerPosition.y;
						const isTarget = x === targetPosition.x && y === targetPosition.y;
						const isBlocked = isPositionBlocked(x, y);

						let bgColor = "bg-white";
						if (isBlocked) {
							bgColor = "cursor-not-allowed border-none";
						} else if (isPlayer) {
							bgColor = "bg-blue-500";
						} else if (isTarget) {
							bgColor = "bg-yellow-500";
						}

						return (
							<div
								key={index}
								className={`aspect-square border-1 border-black ${bgColor}`}
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

				{/* Control Buttons */}
				<div className="mt-30">
					{/* Arrow Controls */}
					<div className="flex flex-col items-center space-y-2">
						{/* Up Button */}
						<button
							onClick={() => movePlayer(0, -1)}
							disabled={gameState !== "playing"}
							className="w-15 h-11 bg-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-300  disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-b-4 border-neutral-900 drop-shadow-xl shadow-yellow-400"
						>
							<svg
								className="w-6 h-6 stroke-white"
								fill="none"
								viewBox="0 0 24 20"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 15l7-7 7 7"
								/>
							</svg>
						</button>

						{/* Middle Row */}
						<div className="flex space-x-3">
							<button
								onClick={() => movePlayer(-1, 0)}
								disabled={gameState !== "playing"}
								className="w-15 h-11 bg-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-b-4 border-neutral-900"
							>
								<svg
									className="w-6 h-6 stroke-white"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
							</button>
							<div className="w-12 h-12"></div>
							<button
								onClick={() => movePlayer(1, 0)}
								disabled={gameState !== "playing"}
								className="w-15 h-11 bg-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-b-4 border-neutral-900"
							>
								<svg
									className="w-6 h-6 stroke-white"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>

						{/* Down Button */}
						<button
							onClick={() => movePlayer(0, 1)}
							disabled={gameState !== "playing"}
							className="w-15 h-11 bg-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-b-4 border-neutral-900"
						>
							<svg
								className="w-6 h-6 stroke-white"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					</div>
				</div>

				{gameState === "finished" && (
					<div className="fixed inset-0 bg-[#0000008c] flex items-center justify-center z-50 p-4 w-full">
						<div className="bg-white p-8 text-center max-w-[345px] w-full">
							<p className="text-black-700 text-[20px] font-bold">
								Your Points: {score}
							</p>

							<div className="flex justify-center items-center mt-4">
								<button
									onClick={startGame}
									className=" bg-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors px-[50px]"
								>
									<span>Retry</span>
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
