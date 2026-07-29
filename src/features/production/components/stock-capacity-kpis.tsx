"use client";

import { Card } from "@/components/ui/card";
import { Loader2, Droplets } from "lucide-react";
import { useLoads, useLoadSummary } from "@/features/production/hooks/use-production";

const CAPACITY = 8000;

function gaugeColor(pct: number): { main: string; light: string; glow: string } {
    if (pct >= 85) return { main: "#ef4444", light: "#fca5a5", glow: "#ef444466" };
    if (pct >= 60) return { main: "#f59e0b", light: "#fcd34d", glow: "#f59e0b66" };
    return { main: "#10b981", light: "#6ee7b7", glow: "#10b98166" };
}

function TankVisualization({ fillPct }: { fillPct: number }) {
    const w = 100;        // cylinder body width
    const h = 200;        // cylinder body height
    const rx = 50;        // x-radius of ellipse caps
    const ry = 14;        // y-radius of ellipse caps (gives 3D depth)
    const cx = 110;       // center x in viewBox
    const bodyTop = 30;   // y where body starts
    const bodyBot = bodyTop + h;

    const { main, light, glow } = gaugeColor(fillPct);

    // Liquid fill: from bottom up
    const liquidH = (fillPct / 100) * h;
    const liquidY = bodyBot - liquidH;

    // Wave path — subtle sine wave on liquid surface
    const waveAmp = 4;
    const wavePoints = 8;
    let wavePath = `M ${cx - rx} ${liquidY}`;
    for (let i = 0; i <= wavePoints; i++) {
        const x = (cx - rx) + (i / wavePoints) * (rx * 2);
        const y = liquidY + Math.sin((i / wavePoints) * Math.PI * 2) * waveAmp;
        wavePath += ` L ${x} ${y}`;
    }
    wavePath += ` L ${cx + rx} ${bodyBot} L ${cx - rx} ${bodyBot} Z`;

    return (
        <svg
            width={220}
            height={260}
            viewBox="0 0 220 260"
            className="overflow-visible"
        >
            <defs>
                {/* Body gradient — left lighter, right darker for 3D */}
                <linearGradient id="cylinderGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--cylinder-light, #d1d5db)" stopOpacity="0.5" />
                    <stop offset="30%" stopColor="var(--cylinder-mid, #f3f4f6)" stopOpacity="0.15" />
                    <stop offset="70%" stopColor="var(--cylinder-mid, #f3f4f6)" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="var(--cylinder-dark, #9ca3af)" stopOpacity="0.4" />
                </linearGradient>
                {/* Liquid gradient */}
                <linearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={main} stopOpacity="0.7" />
                    <stop offset="40%" stopColor={light} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={main} stopOpacity="0.6" />
                </linearGradient>
                {/* Glow filter on liquid top */}
                <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                {/* Clip to cylinder body */}
                <clipPath id="cylinderClip">
                    <rect x={cx - rx} y={bodyTop} width={rx * 2} height={h} />
                </clipPath>
                {/* Reflection gradient */}
                <linearGradient id="reflectGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="20%" stopColor="white" stopOpacity="0.18" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* ── Cylinder body outline ── */}
            {/* Body rectangle + rounded bottom cap */}
            <rect
                x={cx - rx}
                y={bodyTop}
                width={rx * 2}
                height={h}
                fill="rgba(156,163,175,0.12)"
                stroke="rgba(156,163,175,0.35)"
                strokeWidth={1.5}
            />

            {/* Bottom cap ellipse — grey base */}
            <ellipse
                cx={cx}
                cy={bodyBot}
                rx={rx}
                ry={ry}
                fill="rgba(156,163,175,0.18)"
                stroke="rgba(156,163,175,0.35)"
                strokeWidth={1.5}
            />

            {/* Bottom cap liquid fill — shown when there is any liquid */}
            {fillPct > 0 && (
                <ellipse
                    cx={cx}
                    cy={bodyBot}
                    rx={rx}
                    ry={ry}
                    fill={main}
                    opacity={0.65}
                />
            )}

            {/* ── Liquid fill (clipped to body) ── */}
            {fillPct > 0 && (
                <g clipPath="url(#cylinderClip)">
                    {/* Main liquid body */}
                    <rect
                        x={cx - rx}
                        y={liquidY}
                        width={rx * 2}
                        height={liquidH + ry}
                        fill="url(#liquidGrad)"
                    />
                    {/* Wave surface */}
                    <path
                        d={wavePath}
                        fill={light}
                        opacity={0.5}
                        filter="url(#liquidGlow)"
                    />
                </g>
            )}

            {/* Liquid top ellipse (surface) — drawn over clip */}
            {fillPct > 0 && fillPct < 100 && (
                <ellipse
                    cx={cx}
                    cy={liquidY}
                    rx={rx}
                    ry={ry}
                    fill={light}
                    opacity={0.75}
                    style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
                />
            )}

            {/* ── Top cap ellipse ── */}
            <ellipse
                cx={cx}
                cy={bodyTop}
                rx={rx}
                ry={ry}
                fill="rgba(209,213,219,0.25)"
                stroke="rgba(156,163,175,0.35)"
                strokeWidth={1.5}
            />

            {/* ── Glass reflection strip ── */}
            <rect
                x={cx - rx}
                y={bodyTop}
                width={rx * 2}
                height={h}
                fill="url(#reflectGrad)"
                rx={2}
            />

            {/* ── Percentage label in centre ── */}
            <text
                x={cx}
                y={bodyTop + h / 2 - 8}
                textAnchor="middle"
                className="fill-gray-900 dark:fill-white"
                style={{ fontSize: 28, fontWeight: 800, fontFamily: "inherit" }}
            >
                {fillPct}%
            </text>
            <text
                x={cx}
                y={bodyTop + h / 2 + 12}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                style={{ fontSize: 10, fontFamily: "inherit" }}
            >
                capacity
            </text>

            {/* ── Tick marks on the right edge ── */}
            {[0, 25, 50, 75, 100].map((tick) => {
                const tickY = bodyBot - (tick / 100) * h;
                return (
                    <g key={tick}>
                        <line
                            x1={cx + rx + 2}
                            y1={tickY}
                            x2={cx + rx + 8}
                            y2={tickY}
                            stroke="rgba(156,163,175,0.5)"
                            strokeWidth={1}
                        />
                        <text
                            x={cx + rx + 12}
                            y={tickY + 3.5}
                            style={{ fontSize: 8, fontFamily: "inherit" }}
                            className="fill-gray-400 dark:fill-gray-500"
                        >
                            {tick}%
                        </text>
                    </g>
                );
            })}

            {/* Current level indicator line */}
            {fillPct > 0 && (
                <line
                    x1={cx - rx - 8}
                    y1={liquidY}
                    x2={cx - rx}
                    y2={liquidY}
                    stroke={main}
                    strokeWidth={2}
                    strokeDasharray="3 2"
                />
            )}
        </svg>
    );
}

export function StockCapacityKpis() {
    const { data: loadsPage, isLoading: isLoadingLoads } = useLoads({ loadType: "field-latex", size: 1, sort: "startDate,desc" });
    const latestLoad = loadsPage?.content?.[0];
    const latestLoadId = latestLoad?.loadId ?? "";

    const { data: summary, isLoading: isLoadingSummary } = useLoadSummary(latestLoadId);

    const isLoading = isLoadingLoads || isLoadingSummary;
    const currentStock = Number(summary?.totalLatexCollected ?? 0);
    const fillPct = Math.min(100, Math.round((currentStock / CAPACITY) * 100));
    const remaining = Math.max(0, CAPACITY - currentStock);
    const { main } = gaugeColor(fillPct);

    return (
        <Card className="shadow-sm p-5 gap-0 relative overflow-hidden">
            {/* Subtle background glow based on fill color */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.09]"
                style={{ background: `radial-gradient(ellipse at 20% 50%, ${main} 0%, transparent 65%)` }}
            />

            {isLoading && (
                <div className="absolute top-4 right-4">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4" style={{ color: main }} />
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                    Latex Tank Capacity
                </p>
                {latestLoadId && (
                    <span className="ml-auto font-mono text-[9px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-brand-600 dark:text-brand-400">
                        {latestLoadId.slice(0, 8).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Main layout: tank on left, stats on right */}
            <div className="flex items-center gap-6">
                {/* 3-D Cylinder Tank */}
                <div className="shrink-0 -ml-2">
                    <TankVisualization fillPct={fillPct} />
                </div>

                {/* Stats panel */}
                <div className="flex flex-col gap-4 flex-1">
                    <div>
                        <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wide mb-0.5">Collected</p>
                        <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                            {currentStock.toLocaleString()}
                            <span className="text-base font-medium text-gray-400 ml-1">L</span>
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wide mb-0.5">Remaining</p>
                        <p className="text-2xl font-bold" style={{ color: main }}>
                            {remaining.toLocaleString()}
                            <span className="text-sm font-medium ml-1 opacity-70">L</span>
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wide mb-0.5">Tank Size</p>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            {CAPACITY.toLocaleString()} L
                        </p>
                    </div>

                    {/* Status badge */}
                    <div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold self-start"
                        style={{ backgroundColor: `${main}22`, color: main }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: main }}
                        />
                        {fillPct >= 85 ? "Near Full" : fillPct >= 60 ? "Filling" : "Healthy"}
                    </div>
                </div>
            </div>
        </Card>
    );
}
