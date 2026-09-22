import React, { useMemo, useRef } from "react";
import type { ModelType, RevealedVote, VotePoint } from "./realtime";

interface ModelVisualProps {
  model: ModelType;
  vote: VotePoint | null;
  revealedVotes: RevealedVote[];
  interactive: boolean;
  onVote?: (vote: VotePoint) => void;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function dotKey(vote: RevealedVote, index: number) {
  return `${Math.round(vote.x * 1000)}-${Math.round(vote.y * 1000)}-${index}`;
}

function VoteDots({
  votes,
  ownVote,
}: {
  votes: RevealedVote[];
  ownVote: VotePoint | null;
}) {
  const visibleVotes = votes.length
    ? votes
    : ownVote
      ? [{ ...ownVote, mine: true }]
      : [];

  return (
    <g className="vote-dots" aria-hidden="true">
      {visibleVotes.map((point, index) => (
        <g
          key={dotKey(point, index)}
          transform={`translate(${point.x * 1000} ${point.y * 600})`}
        >
          <circle
            className={`vote-halo ${point.mine ? "vote-halo--mine" : ""}`}
            r={point.mine ? 27 : 22}
          />
          <circle
            className={`vote-dot ${point.mine ? "vote-dot--mine" : ""}`}
            r={point.mine ? 12 : 9}
          >
            <animate
              attributeName="r"
              values={point.mine ? "10;14;12" : "7;11;9"}
              dur="520ms"
              begin={`${index * 45}ms`}
              fill="freeze"
            />
          </circle>
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
  const ariaLabel =
    model === "comfort"
      ? "Comfort, stretch and chaos model. Choose where you are by clicking the model."
      : "Tuckman team development model. Choose where you are from forming through performing.";

  const zoneHint = useMemo(() => {
    if (!vote) return "Choose a point on the model";

    if (model === "tuckman") {
      const labels = ["Forming", "Storming", "Norming", "Performing"];
      return labels[Math.min(3, Math.floor(vote.x * 4))];
    }

    const dx = vote.x - 0.5;
    const dy = vote.y - 0.5;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= 0.15) return "Comfort";
    if (distance <= 0.33) return "Stretch";
    return "Chaos";
  }, [model, vote]);

  const choose = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive || !onVote || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    onVote({
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    });
  };

  return (
    <div className={`model-shell model-shell--${model}`}>
      <svg
        ref={svgRef}
        className={`team-model ${interactive ? "team-model--interactive" : ""}`}
        viewBox="0 0 1000 600"
        role="img"
        aria-label={ariaLabel}
        onPointerUp={choose}
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
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {model === "comfort" ? (
          <g className="comfort-visual">
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
              className="bouncy-shape bouncy-shape--slow"
              cx="500"
              cy="300"
              r="248"
              fill="rgba(33,53,84,.62)"
              stroke="rgba(180,190,255,.28)"
              strokeWidth="2"
            />
            <circle
              className="bouncy-shape bouncy-shape--medium"
              cx="500"
              cy="300"
              r="190"
              fill="url(#comfortStretch)"
              stroke="rgba(103,232,249,.44)"
              strokeWidth="3"
            />
            <circle
              className="bouncy-shape bouncy-shape--fast"
              cx="500"
              cy="300"
              r="88"
              fill="url(#comfortCore)"
              stroke="rgba(255,255,255,.56)"
              strokeWidth="3"
              filter="url(#softGlow)"
            />
            <text
              className="model-label model-label--chaos"
              x="500"
              y="70"
              textAnchor="middle"
            >
              CHAOS
            </text>
            <text className="model-label" x="500" y="144" textAnchor="middle">
              STRETCH
            </text>
            <text
              className="model-label model-label--dark"
              x="500"
              y="308"
              textAnchor="middle"
            >
              COMFORT
            </text>
            <text className="model-caption" x="500" y="550" textAnchor="middle">
              growth gets useful in stretch • overwhelm lives at the edge
            </text>
          </g>
        ) : (
          <g className="tuckman-visual">
            <rect
              className="model-backdrop"
              x="18"
              y="18"
              width="964"
              height="564"
              rx="48"
              fill="#10192a"
            />
            <path
              d="M70 440 C190 410, 235 165, 335 300 S505 455, 580 260 S720 150, 930 118"
              fill="none"
              stroke="url(#tuckmanFlow)"
              strokeWidth="24"
              strokeLinecap="round"
              opacity=".72"
            />
            {[0, 1, 2, 3].map((index) => (
              <g
                key={index}
                className="tuckman-stage"
                style={{ animationDelay: `${index * 80}ms` }}
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
                  {(["FORMING", "STORMING", "NORMING", "PERFORMING"] as const)[index]}
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
            <text className="model-caption" x="500" y="560" textAnchor="middle">
              teams move through the stages — and sometimes loop backwards
            </text>
          </g>
        )}

        <VoteDots votes={revealedVotes} ownVote={vote} />
      </svg>

      <div className="model-hint" aria-live="polite">
        <strong>{zoneHint}</strong>
        <span>
          {interactive
            ? "Click anywhere to place or move your anonymous vote."
            : "Voting is private until the host reveals the room."}
        </span>
      </div>
    </div>
  );
}
