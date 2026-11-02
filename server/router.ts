import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
export type Task = { id: string; title: string; description: string; createdAt: number };
// One ephemeral store per server process.
const state = globalThis as typeof globalThis & { taskStore?: Task[] };
const tasks = state.taskStore ??= [];
const t = initTRPC.create();
const fields = z.object({ title: z.string().trim().min(1, 'TITLE_REQUIRED').max(120), description: z.string().trim().max(1000) });
export const appRouter = t.router({
 list: t.procedure.query(() => [...tasks].sort((a,b) => b.createdAt-a.createdAt)),
 create: t.procedure.input(fields).mutation(({input}) => { const task = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }; tasks.push(task); return task; }),
 update: t.procedure.input(fields.extend({id:z.string()})).mutation(({input}) => { const task = tasks.find(t => t.id === input.id); if (!task) throw new TRPCError({code:'NOT_FOUND',message:'TASK_NOT_FOUND'}); Object.assign(task, input); return task; }),
 delete: t.procedure.input(z.object({id:z.string()})).mutation(({input}) => { const i = tasks.findIndex(t => t.id === input.id); if (i < 0) throw new TRPCError({code:'NOT_FOUND',message:'TASK_NOT_FOUND'}); tasks.splice(i,1); return true; })
});
export type AppRouter = typeof appRouter;
