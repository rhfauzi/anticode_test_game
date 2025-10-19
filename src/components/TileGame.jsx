"use client";
import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 6;
const TOTAL_TIME = 60;

export default function TileGame() {
	const [gameState, setGameState] = useState("idle");
	const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
	const [score, setScore] = useState(0);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="bg-red-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
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
