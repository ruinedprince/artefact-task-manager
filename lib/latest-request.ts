// Invalidates earlier reads when a newer read or a mutation starts.
export function createLatestRequestGate() {
  let version = 0;
  return {
    invalidate() { version += 1; },
    begin() { const started = ++version; return () => started === version; },
  };
}
