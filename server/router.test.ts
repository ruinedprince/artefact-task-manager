import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appRouter } from './router';

test('CRUD accepts omitted descriptions and rejects invalid requests', async () => {
  const api = appRouter.createCaller({});
  const task = await api.create({ title: '  Example  ' });
  assert.equal(task.title, 'Example');
  assert.equal(task.description, '');
  assert.ok((await api.list()).some(item => item.id === task.id));
  const updated = await api.update({ id: task.id, title: 'Updated' });
  assert.equal(updated.description, '');
  await api.update({ id: task.id, title: 'Updated', description: 'Keep me' });
  assert.equal((await api.update({ id: task.id, title: 'Renamed' })).description, 'Keep me');
  await assert.rejects(api.create({ title: '  ' }));
  await api.delete({ id: task.id });
  await assert.rejects(api.update({ id: task.id, title: 'Missing' }), { code: 'NOT_FOUND' });
  await assert.rejects(api.delete({ id: task.id }), { code: 'NOT_FOUND' });
});
