import "@testing-library/jest-dom/vitest";
import { expect, it, test } from "vitest";

// Ensure React 18+ act() warnings are suppressed in tests that wrap updates in act.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

(globalThis as typeof globalThis & { test?: typeof test; it?: typeof it; expect?: typeof expect }) = Object.assign(globalThis, {
  test,
  it,
  expect,
});
