import React, { useMemo, useRef, useState } from "react";
import type { ModelType, RevealedVote, VotePoint } from "./realtime";

interface ModelVisualProps {
  model: ModelType;
  vote: VotePoint | null;
  revealedVotes: RevealedVote[];
  interactive: boolean;
  onVote?: (vote: VotePoint) => void;
}

type ComfortZone = "Comfort" | "Stretch" | "Chaos";
type TuckmanStage = "Forming" | "Storming" | "Norming" | "Performing";
type AreaName = ComfortZone | TuckmanStage;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const TUCKMAN_LABELS: TuckmanStage[] = ["Forming", "Storming", "Norming", "Performing"];

function smoothstep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function performanceToY(performance: number) {
  return 0.83 - clamp(performance) * 0.66;
}

export function tuckmanYForX(x: number) {
  const anchors = [
    { x: 0.05, y: performanceToY(0.5) },
    { x: 0.125, y: performanceToY(0.5) },
    { x: 0.375, y: performanceToY(0.2) },
    { x: 0.875, y: performanceToY(0.8) },
    { x: 0.95, y: performanceToY(0.8) },
  ];

  const clampedX = Math.max(anchors[0].x, Math.min(anchors[anchors.length - 1].x, x));
  for (let index = 0; index < anchors.length - 1; index += 1) {
    const start = anchors[index];
    const end = anchors[index + 1];
    if (clampedX <= end.x) {
      const progress = smoothstep((clampedX - start.x) / (end.x - start.x));
      return start.y + (end.y - start.y) * progress;
    }
  }
  return anchors[anchors.length - 1].y;
}

export function projectTuckmanVote(vote: RevealedVote): RevealedVote {
  const x = Math.max(0.05, Math.min(0.95, vote.x));
  return { ...vote, x, y: tuckmanYForX(x) };
}

function votePixelRadius(vote: VotePoint) {
  const dx = (vote.x - 0.5) * 1000;
  const dy = (vote.y - 0.5) * 600;
  return Math.sqrt(dx * dx + dy * dy);
}

export function comfortZoneForVote(vote: VotePoint): ComfortZone {
  const radius = votePixelRadius(vote);
  if (radius <= 88) return "Comfort";
  if (radius <= 190) return "Stretch";
  return "Chaos";
}

export function tuckmanStageForVote(vote: VotePoint): TuckmanStage {
  return TUCKMAN_LABELS[Math.min(3, Math.floor(clamp(vote.x) * 4))];
}

export function arrangeComfortVotes(votes: RevealedVote[]): RevealedVote[] {
  if (!votes.length) return [];

  const ranked = votes
    .map((vote, originalIndex) => ({
      vote,
      originalIndex,
      radius: votePixelRadius(vote),
    }))
    .sort((a, b) => a.radius - b.radius || a.originalIndex - b.originalIndex);

  const angleStep = (Math.PI * 2) / ranked.length;

  return ranked.map(({ vote, radius }, index) => {
    const angle = index * angleStep;
    return {
      ...vote,
      x: (500 + Math.cos(angle) * radius) / 1000,
      y: (300 + Math.sin(angle) * radius) / 600,
    };
  });
}

function dotKey(vote: RevealedVote, index: number) {
  return `${Math.round(vote.x * 1000)}-${Math.round(vote.y * 1000)}-${index}`;
}

function VoteDots({
  votes,
  ownVote,
  model,
}: {
  votes: RevealedVote[];
  ownVote: VotePoint | null;
  model: ModelType;
}) {
  const visibleVotes = useMemo(() => {
    if (votes.length) {
      return model === "tuckman"
        ? votes.map(projectTuckmanVote)
        : arrangeComfortVotes(votes);
    }
    if (!ownVote) return [];
    const privateVote = { ...ownVote, mine: true };
    return model === "tuckman" ? [projectTuckmanVote(privateVote)] : [privateVote];
  }, [model, ownVote, votes]);

  return (
    <g className="vote-dots" aria-hidden="true">
      {visibleVotes.map((point, index) => (
        <g
          key={dotKey(point, index)}
          transform={`translate(${point.x * 1000} ${point.y * 600})`}
        >
          <circle
            className={`vote-halo vote-dot-appear ${point.mine ? "vote-halo--mine" : ""}`}
            style={{ animationDelay: `${index * 55}ms` }}
            r={point.mine ? 27 : 22}
          />
          <circle
            className={`vote-dot vote-dot-appear ${point.mine ? "vote-dot--mine" : ""}`}
            style={{ animationDelay: `${index * 55}ms` }}
            r={point.mine ? 12 : 9}
          />
          {point.mine && (
            <text className="vote-you vote-dot-appear" x="0" y="-26" textAnchor="middle">
              you
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

function clientPointToModel(
  event: React.PointerEvent<SVGSVGElement>,
  svg: SVGSVGElement,
): VotePoint {
  const rect = svg.getBoundingClientRect();
  const viewWidth = 1000;
  const viewHeight = 600;
  const scale = Math.min(rect.width / viewWidth, rect.height / viewHeight);
  const renderedWidth = viewWidth * scale;
  const renderedHeight = viewHeight * scale;
  const offsetX = (rect.width - renderedWidth) / 2;
  const offsetY = (rect.height - renderedHeight) / 2;

  const viewX = (event.clientX - rect.left - offsetX) / scale;
  const viewY = (event.clientY - rect.top - offsetY) / scale;

  return {
    x: clamp(viewX / viewWidth),
    y: clamp(viewY / viewHeight),
  };
}

export function ModelVisual({
  model,
  vote,
  revealedVotes,
  interactive,
  onVote,
}: ModelVisualProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredArea, setHoveredArea] = useState<AreaName | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 50, y: 12 });
  const [comfortPulse, setComfortPulse] = useState<{ point: VotePoint; key: number } | null>(null);
  const [spark, setSpark] = useState<{
    key: number;
    from: VotePoint;
    to: VotePoint;
  } | null>(null);

  const ariaLabel =
    model === "comfort"
      ? "Comfort, stretch and chaos model. Choose where you are by clicking the model."
      : "Tuckman team development model. Choose where you are from forming through performing.";

  const zoneHint = useMemo(() => {
    if (!vote) return "Choose a point on the model";
    return model === "tuckman" ? tuckmanStageForVote(vote) : comfortZoneForVote(vote);
  }, [model, vote]);

  const areaStats = useMemo(() => {
    const names: AreaName[] =
      model === "tuckman" ? TUCKMAN_LABELS : ["Comfort", "Stretch", "Chaos"];
    const counts = Object.fromEntries(names.map((name) => [name, 0])) as Record<AreaName, number>;
    for (const revealedVote of revealedVotes) {
      const area =
        model === "tuckman"
          ? tuckmanStageForVote(revealedVote)
          : comfortZoneForVote(revealedVote);
      counts[area] += 1;
    }
    return counts;
  }, [model, revealedVotes]);

  const totalVotes = revealedVotes.length;
  const tooltipCount = hoveredArea ? areaStats[hoveredArea] || 0 : 0;
  const tooltipPercent = totalVotes ? Math.round((tooltipCount / totalVotes) * 100) : 0;

  const pointFromEvent = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return null;
    return clientPointToModel(event, svgRef.current);
  };

  const choose = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive || !onVote) return;
    const point = pointFromEvent(event);
    if (!point) return;

    if (model === "tuckman") {
      setSpark({
        key: Date.now(),
        from: point,
        to: { x: point.x, y: tuckmanYForX(point.x) },
      });
    } else {
      setComfortPulse({ point, key: Date.now() });
    }

    onVote(point);
  };

  const hover = (event: React.PointerEvent<SVGSVGElement>) => {
    const point = pointFromEvent(event);
    if (!point) return;
    setHoveredArea(
      model === "tuckman" ? tuckmanStageForVote(point) : comfortZoneForVote(point),
    );
    setTooltipPosition({
      x: clamp(point.x) * 100,
      y: clamp(point.y) * 100,
    });
  };

  const tuckmanPath = useMemo(() => {
    const points = Array.from({ length: 100 }, (_, index) => {
      const x = 0.05 + (0.9 * index) / 99;
      return `${index ? "L" : "M"} ${Math.round(x * 1000)} ${Math.round(tuckmanYForX(x) * 600)}`;
    });
    return points.join(" ");
  }, []);

  return (
    <div className={`model-shell model-shell--${model}`}>
      <svg
        ref={svgRef}
        className={`team-model ${interactive ? "team-model--interactive" : ""}`}
        viewBox="0 0 1000 600"
        role="img"
        aria-label={ariaLabel}
        onPointerUp={choose}
        onPointerMove={hover}
        onPointerLeave={() => setHoveredArea(null)}
      >
        <defs>
          <linearGradient id="comfortChaos" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2f2449" />
            <stop offset="1" stopColor="#152540" />
          </linearGradient>
          <linearGradient id="comfortStretch" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#256b78" />
            <stop offset="1" stopColor="#3b4e8c" />
          </linearGradient>
          <linearGradient id="comfortCore" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7fe8d1" />
            <stop offset="1" stopColor="#58a6ff" />
          </linearGradient>
          <linearGradient id="tuckmanFlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#536078" />
            <stop offset="0.34" stopColor="#7c4f8d" />
            <stop offset="0.68" stopColor="#2b7794" />
            <stop offset="1" stopColor="#42b99a" />
          </linearGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sparkGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {model === "comfort" ? (
          <g className="comfort-visual model-enter">
            <rect
              className="model-backdrop"
              x="18"
              y="18"
              width="964"
              height="564"
              rx="48"
              fill="url(#comfortChaos)"
            />
            <circle
              className="comfort-zone comfort-zone--chaos"
              cx="500"
              cy="300"
              r="248"
              fill="rgba(33,53,84,.62)"
              stroke="rgba(180,190,255,.28)"
              strokeWidth="2"
            />
            <circle
              className="comfort-zone comfort-zone--stretch"
              cx="500"
              cy="300"
              r="190"
              fill="url(#comfortStretch)"
              stroke="rgba(103,232,249,.44)"
              strokeWidth="3"
            />
            <circle
              className="comfort-zone comfort-zone--comfort"
              cx="500"
              cy="300"
              r="88"
              fill="url(#comfortCore)"
              stroke="rgba(255,255,255,.56)"
              strokeWidth="3"
              filter="url(#softGlow)"
            />
            {comfortPulse && (
              <g key={comfortPulse.key} className="comfort-ripples" aria-hidden="true">
                {[0, 1, 2].map((index) => (
                  <circle
                    key={index}
                    className="comfort-ripple"
                    cx={comfortPulse.point.x * 1000}
                    cy={comfortPulse.point.y * 600}
                    r="10"
                    style={{ animationDelay: `${index * 85}ms` }}
                  />
                ))}
              </g>
            )}
            <text className="model-label model-label--chaos" x="500" y="70" textAnchor="middle">
              CHAOS
            </text>
            <text className="model-label" x="500" y="144" textAnchor="middle">
              STRETCH
            </text>
            <text className="model-label model-label--dark" x="500" y="308" textAnchor="middle">
              COMFORT
            </text>
            <text className="model-caption" x="500" y="550" textAnchor="middle">
              growth gets useful in stretch • overwhelm lives at the edge
            </text>
          </g>
        ) : (
          <g className="tuckman-visual model-enter">
            <rect
              className="model-backdrop"
              x="18"
              y="18"
              width="964"
              height="564"
              rx="48"
              fill="#10192a"
            />
            {[0, 1, 2, 3].map((index) => (
              <g
                key={index}
                className="tuckman-stage stage-enter"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <rect
                  x={55 + index * 225}
                  y="70"
                  width="210"
                  height="455"
                  rx="34"
                  className={`tuckman-zone tuckman-zone--${index}`}
                />
                <text
                  className="model-label"
                  x={160 + index * 225}
                  y="116"
                  textAnchor="middle"
                >
                  {TUCKMAN_LABELS[index].toUpperCase()}
                </text>
                <text
                  className="stage-number"
                  x={160 + index * 225}
                  y="485"
                  textAnchor="middle"
                >
                  0{index + 1}
                </text>
              </g>
            ))}
            <g key={spark?.key ?? "steady-line"} className={spark ? "tuckman-line-impact" : undefined}>
              <path
                className="tuckman-flow-line"
                d={tuckmanPath}
                fill="none"
                stroke="url(#tuckmanFlow)"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity=".82"
              />
            </g>
            <text className="model-caption" x="500" y="566" textAnchor="middle">
              forming begins steady • storming dips • norming rebuilds • performing holds high
            </text>

            {spark && (
              <g key={spark.key} className="anime-impact" filter="url(#sparkGlow)" aria-hidden="true">
                <circle
                  className="spark-particle"
                  cx={spark.from.x * 1000}
                  cy={spark.from.y * 600}
                  r="9"
                >
                  <animateMotion
                    dur="220ms"
                    fill="freeze"
                    path={`M 0 0 L ${(spark.to.x - spark.from.x) * 1000} ${(spark.to.y - spark.from.y) * 600}`}
                  />
                  <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.72;1" dur="360ms" fill="freeze" />
                </circle>
                {[0, 1, 2].map((index) => (
                  <circle
                    key={index}
                    className="tuckman-impact-ripple"
                    cx={spark.to.x * 1000}
                    cy={spark.to.y * 600}
                    r="8"
                    style={{ animationDelay: `${180 + index * 70}ms` }}
                  />
                ))}
                <line
                  className="spark-flare"
                  x1={spark.to.x * 1000 - 30}
                  y1={spark.to.y * 600}
                  x2={spark.to.x * 1000 + 30}
                  y2={spark.to.y * 600}
                />
                <line
                  className="spark-flare"
                  x1={spark.to.x * 1000}
                  y1={spark.to.y * 600 - 30}
                  x2={spark.to.x * 1000}
                  y2={spark.to.y * 600 + 30}
                />
              </g>
            )}
          </g>
        )}

        <VoteDots votes={revealedVotes} ownVote={vote} model={model} />
      </svg>

      {hoveredArea && (
        <div
          className="model-tooltip"
          style={{
            left: `${tooltipPosition.x}%`,
            top: `${tooltipPosition.y}%`,
          }}
        >
          <strong>{hoveredArea}</strong>
          {totalVotes ? (
            <span>
              {tooltipCount} {tooltipCount === 1 ? "person" : "people"}
              {model === "comfort" ? ` · ${tooltipPercent}%` : ""}
            </span>
          ) : (
            <span>Votes hidden until reveal</span>
          )}
        </div>
      )}

      <div className="model-hint" aria-live="polite">
        <strong>{zoneHint}</strong>
        <span>
          {interactive
            ? "Click anywhere to place or move your anonymous vote."
            : totalVotes
              ? "Hover an area to see the revealed distribution."
              : "Voting is private until the host reveals the room."}
        </span>
      </div>
    </div>
  );
}
