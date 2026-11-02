import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appRouter } from './router';

test('cursor pagination survives inserts and deletion of the cursor task', async () => {
  const api = appRouter.createCaller({});
  const created = await Promise.all(Array.from({length: 25}, (_, i) => api.create({title:`Task ${i}`})));
  try {
    const first = await api.list({limit: 10});
    assert.equal(first.items.length, 10);
    assert.ok(first.nextCursor);
    await api.delete({id:first.nextCursor.id});
    const unseen = created.find(task => !first.items.some(item => item.id === task.id))!;
    await api.update({id:unseen.id,title:'Updated between pages'});
    await new Promise(resolve => setTimeout(resolve, 2));
    const inserted = await api.create({title:'New'});
    try {
      const second = await api.list({limit:10, cursor:first.nextCursor});
      assert.equal(second.items.length, 10);
      assert.equal(second.items.filter(task => first.items.some(old => old.id === task.id)).length, 0);
      const third = await api.list({limit:10, cursor:second.nextCursor!});
      assert.equal(third.items.length, 5);
      assert.equal(third.nextCursor, null);
      assert.ok([...second.items, ...third.items].some(task => task.id === unseen.id && task.title === 'Updated between pages'));
    } finally { await api.delete({id:inserted.id}); }
  } finally {
    for (const task of created) await api.delete({id:task.id}).catch(() => {});
  }
});
