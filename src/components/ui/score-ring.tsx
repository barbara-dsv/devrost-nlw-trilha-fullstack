import * as React from "react";
import { tv } from "tailwind-variants";

const scoreRingVariants = tv({
  base: "inline-flex items-center justify-center",
});

export interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
}

// ScoreRing Root - Container principal
const ScoreRingRoot = React.forwardRef<HTMLDivElement, ScoreRingProps>(
  (
    {
      className,
      score = 0,
      maxScore = 10,
      size = 180,
      strokeWidth = 4,
      children,
      ...props
    },
    ref,
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(score / maxScore, 1);
    const offset = circumference - progress * circumference;

    return (
      <div
        ref={ref}
        className={scoreRingVariants({ className })}
        style={{ width: size, height: size }}
        {...props}
      >
        <div className="relative" style={{ width: size, height: size }}>
          {children || (
            <>
              <ScoreRingCircle
                size={size}
                strokeWidth={strokeWidth}
                radius={radius}
                circumference={circumference}
                offset={offset}
              />
              <ScoreRingText size={size} score={score} maxScore={maxScore} />
            </>
          )}
        </div>
      </div>
    );
  },
);
ScoreRingRoot.displayName = "ScoreRingRoot";

// Circle Component - Anéis SVG
interface ScoreRingCircleProps {
  size: number;
  strokeWidth: number;
  radius: number;
  circumference: number;
  offset: number;
}

const ScoreRingCircle = React.forwardRef<SVGSVGElement, ScoreRingCircleProps>(
  ({ size, strokeWidth, radius, circumference, offset }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        className="absolute inset-0 transform -rotate-90"
        role="img"
        aria-label="Score ring visualization"
      >
        {/* Anel exterior */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        {/* Anel com gradiente */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    );
  },
);
ScoreRingCircle.displayName = "ScoreRingCircle";

// Text Component - Texto da pontuação
interface ScoreRingTextProps {
  size: number;
  score: number;
  maxScore: number;
}

const ScoreRingText = React.forwardRef<HTMLDivElement, ScoreRingTextProps>(
  ({ size, score, maxScore }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
      >
        <span className="text-4xl font-bold text-foreground leading-none">
          {score.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground leading-none">
          /{maxScore}
        </span>
      </div>
    );
  },
);
ScoreRingText.displayName = "ScoreRingText";

export const ScoreRing = {
  Root: ScoreRingRoot,
  Circle: ScoreRingCircle,
  Text: ScoreRingText,
};

export interface ScoreRingPropsExport extends ScoreRingProps {}
