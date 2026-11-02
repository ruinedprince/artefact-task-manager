import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title:'Forma — tarefas', description:'Um espaço simples para organizar tarefas.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html>; }
