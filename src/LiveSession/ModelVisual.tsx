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

export function tuckmanYForX(x: number) {
  const anchors = [
    { x: 0.08, y: 400 / 600 },
    { x: 0.375, y: 500 / 600 },
    { x: 0.625, y: 200 / 600 },
    { x: 0.875, y: 100 / 600 },
    { x: 0.95, y: 100 / 600 },
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
  const x = Math.max(0.08, Math.min(0.95, vote.x));
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
    .map((vote, originalIndex) => ({ vote, originalIndex, intensity: votePixelRadius(vote) }))
    .sort((a, b) => a.intensity - b.intensity || a.originalIndex - b.originalIndex);

  const turns = Math.max(1.2, Math.min(2.8, ranked.length / 4));
  const maxIntensity = Math.max(1, ...ranked.map((item) => item.intensity));

  return ranked.map(({ vote, intensity }, index) => {
    const progress = ranked.length === 1 ? 0.5 : index / (ranked.length - 1);
    const angle = -Math.PI / 2 + progress * Math.PI * 2 * turns;
    const intensityRatio = clamp(intensity / maxIntensity);
    const radius = 26 + intensityRatio * 220;
    return {
      ...vote,
      x: clamp((500 + Math.cos(angle) * radius) / 1000),
      y: clamp((300 + Math.sin(angle) * radius) / 600),
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
          className="vote-dot-group"
          style={{ animationDelay: `${index * 55}ms` }}
          transform={`translate(${point.x * 1000} ${point.y * 600})`}
        >
          <circle
            className={`vote-halo ${point.mine ? "vote-halo--mine" : ""}`}
            r={point.mine ? 27 : 22}
          />
          <circle
            className={`vote-dot ${point.mine ? "vote-dot--mine" : ""}`}
            r={point.mine ? 12 : 9}
          />
          {point.mine && (
            <text className="vote-you" x="0" y="-26" textAnchor="middle">
              you
            </text>
          )}
        </g>
      ))}
    </g>
  );
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
  const [comfortPulse, setComfortPulse] = useState<{ zone: ComfortZone; key: number } | null>(null);
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
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    };
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
      setComfortPulse({ zone: comfortZoneForVote(point), key: Date.now() });
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
    const points = Array.from({ length: 90 }, (_, index) => {
      const x = 0.08 + (0.87 * index) / 89;
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
              <circle
                key={comfortPulse.key}
                className="comfort-click-pulse"
                cx="500"
                cy="300"
                r={
                  comfortPulse.zone === "Comfort"
                    ? 88
                    : comfortPulse.zone === "Stretch"
                      ? 190
                      : 248
                }
              />
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
            <text className="performance-marker" x="80" y="386" textAnchor="middle">25%</text>
            <text className="performance-marker" x="375" y="540" textAnchor="middle">0%</text>
            <text className="performance-marker" x="625" y="180" textAnchor="middle">75%</text>
            <text className="performance-marker" x="875" y="82" textAnchor="middle">100%</text>
            <text className="model-caption" x="500" y="566" textAnchor="middle">
              forming starts with potential • storming dips • norming and performing climb
            </text>

            {spark && (
              <g key={spark.key} className="anime-spark" filter="url(#sparkGlow)">
                <line
                  className="spark-trail spark-trail--glow"
                  x1={spark.from.x * 1000}
                  y1={spark.from.y * 600}
                  x2={spark.to.x * 1000}
                  y2={spark.to.y * 600}
                />
                <line
                  className="spark-trail"
                  x1={spark.from.x * 1000}
                  y1={spark.from.y * 600}
                  x2={spark.to.x * 1000}
                  y2={spark.to.y * 600}
                />
                <line
                  className="spark-flare"
                  x1={spark.to.x * 1000 - 34}
                  y1={spark.to.y * 600}
                  x2={spark.to.x * 1000 + 34}
                  y2={spark.to.y * 600}
                />
                <line
                  className="spark-flare"
                  x1={spark.to.x * 1000}
                  y1={spark.to.y * 600 - 34}
                  x2={spark.to.x * 1000}
                  y2={spark.to.y * 600 + 34}
                />
                <circle
                  className="spark-core"
                  cx={spark.to.x * 1000}
                  cy={spark.to.y * 600}
                  r="10"
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
              {tooltipCount} {tooltipCount === 1 ? "person" : "people"} · {tooltipPercent}%
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
