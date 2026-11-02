import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
export type Task = { id: string; title: string; description: string; createdAt: number };
// One ephemeral store per server process.
const state = globalThis as typeof globalThis & { taskStore?: Task[] };
const tasks = state.taskStore ??= [];
const t = initTRPC.create();
const fields = z.object({ title: z.string().trim().min(1, 'TITLE_REQUIRED').max(120), description: z.string().trim().max(1000).optional() });
const cursor = z.object({ createdAt: z.number(), id: z.string() });
export const appRouter = t.router({
 list: t.procedure.input(z.object({ cursor: cursor.optional(), limit: z.number().int().min(1).max(100).default(10) }).default({limit: 10})).query(({input}) => {
  // A stable composite cursor remains usable even if its task was deleted.
  const ordered = [...tasks].sort((a,b) => b.createdAt-a.createdAt || b.id.localeCompare(a.id));
  const remaining = input.cursor ? ordered.filter(task => task.createdAt < input.cursor!.createdAt || (task.createdAt === input.cursor!.createdAt && task.id.localeCompare(input.cursor!.id) < 0)) : ordered;
  const items = remaining.slice(0, input.limit);
  const last = items.at(-1);
  return { items, total: ordered.length, nextCursor: remaining.length > input.limit && last ? {createdAt:last.createdAt,id:last.id} : null };
 }),
 create: t.procedure.input(fields).mutation(({input}) => { const task = { ...input, description: input.description ?? '', id: crypto.randomUUID(), createdAt: Date.now() }; tasks.push(task); return task; }),
 update: t.procedure.input(fields.extend({id:z.string()})).mutation(({input}) => { const task = tasks.find(t => t.id === input.id); if (!task) throw new TRPCError({code:'NOT_FOUND',message:'TASK_NOT_FOUND'}); task.title = input.title; if (input.description !== undefined) task.description = input.description; return task; }),
 delete: t.procedure.input(z.object({id:z.string()})).mutation(({input}) => { const i = tasks.findIndex(t => t.id === input.id); if (i < 0) throw new TRPCError({code:'NOT_FOUND',message:'TASK_NOT_FOUND'}); tasks.splice(i,1); return true; })
});
export type AppRouter = typeof appRouter;
export type TaskPage = Awaited<ReturnType<ReturnType<typeof appRouter.createCaller>['list']>>;
