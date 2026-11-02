import { appRouter } from '../server/router';
import { Workspace } from '../components/Workspace';
export const dynamic = 'force-dynamic';
export default async function Page() { const initial = await appRouter.createCaller({}).list(); return <Workspace initial={initial}/>; }

