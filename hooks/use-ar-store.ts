'use client';

import { create } from 'zustand';

export type Artwork = {
	id: number;
	title: string;
	image: string;
	price?: number;
};

type Transform = {
	scale: number; // 1 = 100%
	rotationDeg: number; // z-rotation in degrees for 2D, around normal for AR
	position: { x: number; y: number; z?: number };
	opacity?: number; // 0..1 for overlay transparency
};

type ARState = {
	selectedArtwork: Artwork | null;
	transform: Transform;
	isARSupported: boolean | null;
	setARSupported: (supported: boolean) => void;
	selectArtwork: (artwork: Artwork) => void;
	setScale: (scale: number) => void;
	setRotation: (deg: number) => void;
	setPosition: (pos: Transform['position']) => void;
	reset: () => void;
};

export const useARStore = create<ARState>((set) => ({
	selectedArtwork: null,
	transform: {
		scale: 1,
		rotationDeg: 0,
		position: { x: 0, y: 0, z: 0 },
		opacity: 1,
	},
	isARSupported: null,
	setARSupported: (supported) => set({ isARSupported: supported }),
	selectArtwork: (artwork) => set({ selectedArtwork: artwork }),
	setScale: (scale) => set((s) => ({ transform: { ...s.transform, scale } })),
	setRotation: (rotationDeg) => set((s) => ({ transform: { ...s.transform, rotationDeg } })),
	setPosition: (position) => set((s) => ({ transform: { ...s.transform, position } })),
	setOpacity: (opacity: number) => set((s) => ({ transform: { ...s.transform, opacity } } as any)),
	reset: () =>
		set({
			selectedArtwork: null,
			transform: { scale: 1, rotationDeg: 0, position: { x: 0, y: 0, z: 0 }, opacity: 1 },
		}),
}));


