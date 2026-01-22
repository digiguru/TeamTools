// Ensure React 18+ act() warnings are suppressed in tests that wrap updates in act.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
