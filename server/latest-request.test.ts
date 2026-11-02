import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLatestRequestGate } from '../lib/latest-request';

test('only the newest list request can apply its result or error', () => {
  const gate = createLatestRequestGate();
  const older = gate.begin();
  const newer = gate.begin();
  assert.equal(newer(), true);
  assert.equal(older(), false);
  gate.invalidate();
  assert.equal(newer(), false);
  assert.equal(gate.begin()(), true);
});
