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

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="bg-red-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
				{/* Game Grid - 6x6 */}
				<div className="grid grid-cols-6 gap-0 mb-3">
					{Array.from({ length: 36 }).map((_, i) => (
						<div
							key={i}
							className="aspect-square flex items-center justify-center bg-white border border-gray-200 text-sm font-medium select-none hover:scale-105 transform transition"
						>
							{i + 1}
						</div>
					))}
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
