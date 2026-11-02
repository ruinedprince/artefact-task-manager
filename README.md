# Forma

Aplicação de tarefas para o desafio técnico: Next.js 15, React, tRPC, Zod e i18next.

Requer Node.js 20 ou superior. Execute `npm install` e `npm run dev`; acesse http://localhost:3000. Para produção, execute `npm run build` e `npm start`.

A listagem inicial é renderizada no servidor em cada requisição pelo caller do router tRPC; o navegador usa o cliente tRPC para as mutações. O Zod valida as entradas no servidor. Dados ficam na memória de um processo: reiniciar apaga as tarefas e múltiplas instâncias não compartilham dados. Portanto use um servidor Node de processo único, e não funções serverless. Não há autenticação; não insira dados pessoais ou sensíveis.
