import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

// Exercises the real production HTTP adapter and server-rendered HTML in one process.
test('HTTP CRUD is reflected in server-rendered HTML', { timeout: 30000 }, async () => {
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], { stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null) throw new Error(`Server exited: ${server.exitCode}`);
      try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'server started');
    const mutate = async (method, data) => {
      const response = await fetch(`${base}/api/trpc/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      return { status: response.status, body: await response.json() };
    };
    const created = await mutate('create', { title: 'SSR fixture', description: 'Example' });
    assert.equal(created.status, 200);
    const id = created.body.result.data.id;
    assert.match(await (await fetch(base)).text(), /SSR fixture/);
    assert.equal((await mutate('update', { id, title: 'Updated fixture' })).status, 200);
    assert.match(await (await fetch(base)).text(), /Updated fixture/);
    assert.equal((await mutate('create', { title: '   ' })).status, 400);
    assert.equal((await mutate('delete', { id })).status, 200);
    assert.doesNotMatch(await (await fetch(base)).text(), /Updated fixture/);
    assert.equal((await mutate('delete', { id })).status, 404);
  } finally {
    server.kill();
  }
});
