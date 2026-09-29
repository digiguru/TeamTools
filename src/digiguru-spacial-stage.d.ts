declare module "@digiguru/spacial-stage" {
  export interface StageRect {
    left: number;
    top: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  }

  export function captureRect(element: Element | null | undefined): StageRect | null;

  export function animateFlip(
    element: Element | null | undefined,
    fromRect: StageRect | null,
    toRect: StageRect | null,
    options?: {
      duration?: number;
      easing?: string;
      reducedMotion?: boolean;
      fromRotate?: number;
      toRotate?: number;
      origin?: "top left" | "center";
    }
  ): Promise<Animation | null>;
}
