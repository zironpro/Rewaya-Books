"use client";

import { useEffect, useState } from "react";

import { TimerIcon } from "@phosphor-icons/react/dist/ssr";

export const CountdownTimer = () => {
	const [timeLeft, setTimeLeft] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date();
			const endOfDay = new Date();
			endOfDay.setHours(23, 59, 59, 999);

			const difference = endOfDay.getTime() - now.getTime();

			if (difference > 0) {
				setTimeLeft({
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			}
		};

		calculateTimeLeft();
		const timer = setInterval(calculateTimeLeft, 1000);
		return () => clearInterval(timer);
	}, []);

	const format = (n: number) => n.toString().padStart(2, "0");

	return (
		<div className="flex items-center gap-2 rounded-sm border border-card/25 bg-mauve-800 px-2 py-1 shadow-500">
			<TimerIcon className="animate-pulse text-yellow-400" weight="fill" />
			<p className="flex items-center gap-1 font-black font-display text-sm text-yellow-400 tabular-nums">
				<span className="flex w-4 items-center justify-center">
					{format(timeLeft.hours)}
				</span>
				<span className="text-muted-foreground">:</span>
				<span className="flex w-4 items-center justify-center">
					{format(timeLeft.minutes)}
				</span>
				<span className="text-muted-foreground">:</span>
				<span className="flex w-4 items-center justify-center">
					{format(timeLeft.seconds)}
				</span>
			</p>
		</div>
	);
};
