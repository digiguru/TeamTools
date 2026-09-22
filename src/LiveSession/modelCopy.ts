import type { ModelType } from "./realtime";

export const MODEL_COPY: Record<ModelType, { title: string; short: string; detail: string }> = {
  comfort: {
    title: "Comfort / stretch / chaos",
    short: "Where is the work landing for people right now?",
    detail: "A fast pulse on psychological load: comfort can feel safe, stretch can support growth, and chaos can signal overload.",
  },
  tuckman: {
    title: "Tuckman team stages",
    short: "Where does the team feel it is in its development?",
    detail: "Place the team across forming, storming, norming and performing to surface different perceptions without naming individuals.",
  },
};
