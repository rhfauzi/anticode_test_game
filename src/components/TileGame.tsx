"use client";
import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 6;
const TOTAL_TIME = 60;

export default function TileGame() {
	const [gameState, setGameState] = useState("idle");
	const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
	const [score, setScore] = useState(0);
	const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
	const [targetPos, setTargetPos] = useState({ x: 4, y: 4 });

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

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
		setPlayerPos({ x: 0, y: 0 });
		setTargetPos(generateRandomPosition());
	};

	useEffect(() => {
		if (timeLeft <= 0) return;
		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	// Start the game on mount
	useEffect(() => {
		console.log("111111111111");
		startGame();
		console.log("playerPos", playerPos);
		console.log("targetPos", targetPos);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="bg-red-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
				{/* Game Grid - 6x6 */}
				<div className="grid grid-cols-6 gap-0 mb-3">
					{Array.from({ length: 36 }).map((_, index) => {
						const x = index % GRID_SIZE;
						const y = Math.floor(index / GRID_SIZE);
						const isPlayer = x === playerPos.x && y === playerPos.y;
						const isTarget = x === targetPos.x && y === targetPos.y;

						let bgColor = "bg-white";
						if (isPlayer) {
							bgColor = "bg-blue-500";
						} else if (isTarget) {
							bgColor = "bg-yellow-500";
						}

						return (
							<div
								key={index}
								className={`
                  aspect-square transition-all duration-200 border-2 border-black
                  ${bgColor}
                  ${isPlayer ? "shadow-lg" : ""}
                `}
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
