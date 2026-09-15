import React from 'react';

/**
 * Safe Image & Avatar Fallback Helper
 * Generates an SVG Data-URI with user initials and high-contrast gradients
 * Prevents broken image icons when third-party URLs (e.g. Unsplash) fail or are blocked.
 */

export function getFallbackAvatar(name?: string, seed: string = 'SG'): string {
  const cleanName = (name || seed).trim();
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'SG';

  const palettes = [
    ['#06b6d4', '#0284c7'], // Cyan
    ['#8b5cf6', '#6366f1'], // Violet
    ['#10b981', '#059669'], // Emerald
    ['#f59e0b', '#d97706'], // Amber
    ['#ec4899', '#be185d'], // Pink
    ['#3b82f6', '#1d4ed8'], // Blue
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }
  const [c1, c2] = palettes[Math.abs(hash) % palettes.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="g_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="64" fill="url(#g_${Math.abs(hash)})"/>
    <text x="64" y="74" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="44" letter-spacing="1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Handle image error by swapping to fallback avatar
 */
export function handleAvatarError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  name?: string,
  seed?: string
) {
  const target = e.currentTarget;
  target.onerror = null; // Prevent infinite loop
  target.src = getFallbackAvatar(name, seed);
}
