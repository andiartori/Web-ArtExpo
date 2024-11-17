"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

// Define interface for the props
interface WavyBackgroundProps extends React.HTMLProps<HTMLDivElement> {
	children?: React.ReactNode;
	className?: string;
	containerClassName?: string;
	colors?: string[];
	waveWidth?: number;
	backgroundFill?: string;
	blur?: number;
	speed?: "slow" | "fast";
	waveOpacity?: number;
}

export const WavyBackground = ({
	children,
	className,
	containerClassName,
	colors,
	waveWidth = 50,
	backgroundFill,
	blur = 5,
	speed = "fast",
	waveOpacity = 0.4,
	...props
}: WavyBackgroundProps) => {
	const noise = createNoise3D();
	let w: number,
		h: number,
		nt: number,
		ctx: CanvasRenderingContext2D | null,
		canvas: HTMLCanvasElement | null;
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Function to get the speed value
	const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

	// Initialize the canvas and setup the context
	const init = () => {
		if (canvasRef.current) {
			canvas = canvasRef.current;
			ctx = canvas.getContext("2d");
			if (ctx) {
				w = ctx.canvas.width = window.innerWidth;
				h = ctx.canvas.height = window.innerHeight;
				ctx.filter = `blur(${blur}px)`;
				nt = 0;

				window.onresize = () => {
					if (ctx) {
						w = ctx.canvas.width = window.innerWidth;
						h = ctx.canvas.height = window.innerHeight;
						ctx.filter = `blur(${blur}px)`;
					}
				};
				render();
			}
		}
	};

	// Default wave colors
	const waveColors = colors || [
		"#FFAD60",
		"#FF6464",
		"#77DD77",
		"#AEC6CF",
		"#FFD1DC",
	];

	// Function to draw the waves
	const drawWave = (layers: number) => {
		if (ctx) {
			nt += getSpeed();
			for (let i = 0; i < layers; i++) {
				ctx.beginPath();
				ctx.lineWidth = waveWidth;
				ctx.strokeStyle = waveColors[i % waveColors.length];
				for (let x = 0; x < w; x += 5) {
					const y = noise(x / 800, 0.3 * i, nt) * 200; // Increased amplitude to 150
					ctx.lineTo(x, y + h * 0.5); // Adjusted to center waves
				}
				ctx.stroke();
				ctx.closePath();
			}
		}
	};

	let animationId: number;
	const render = () => {
		if (ctx) {
			ctx.fillStyle = backgroundFill || "rgba(10, 10, 10, 0.5)";
			ctx.globalAlpha = waveOpacity;
			ctx.fillRect(0, 0, w, h);
			drawWave(3);

			animationId = requestAnimationFrame(render);
		}
	};

	useEffect(() => {
		init();
		return () => {
			cancelAnimationFrame(animationId);
		};
	}, []);

	const [isSafari, setIsSafari] = useState(false);
	useEffect(() => {
		setIsSafari(
			typeof window !== "undefined" &&
				navigator.userAgent.includes("Safari") &&
				!navigator.userAgent.includes("Chrome")
		);
	}, []);

	return (
		<div
			className={cn(
				"h-screen flex flex-col items-center justify-center",
				containerClassName
			)}
			{...props} // Spread remaining props onto the div
		>
			<canvas
				className="absolute inset-0 z-0"
				ref={canvasRef}
				id="canvas"
				style={{
					...(isSafari ? { filter: `blur(${blur}px)` } : {}),
				}}
			></canvas>
			<div className={cn("relative z-10", className)}>{children}</div>
		</div>
	);
};
