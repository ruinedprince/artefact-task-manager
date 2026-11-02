# Forma

Gerenciador de tarefas criado para o desafio técnico da Artefact. Permite criar, listar, editar e excluir tarefas; cada uma possui identificador, título obrigatório, descrição opcional e data de criação. A interface também apresenta as respostas teóricas do case em português, inglês e espanhol.

## Executar

Requisitos: Node.js 20.9 ou superior e npm. Não há banco de dados, variáveis de ambiente ou serviços externos obrigatórios.

```sh
npm ci
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). Para executar a versão de produção local:

```sh
npm run build
npm start
```

## Verificar

```sh
npm test                  # testes de domínio, paginação, concorrência e traduções
npm run build             # compilação de produção e verificação de tipos
npm run test:integration  # após o build: HTTP real e HTML renderizado no servidor
npm audit                 # auditoria de dependências
```

O teste de integração inicia e encerra seu próprio servidor local, em uma porta livre. Não são necessárias credenciais.

## Como funciona

- Next.js 15 e React: a rota principal é dinâmica e renderiza a primeira página no servidor a cada requisição. A navegação e as operações seguintes acontecem no cliente.
- tRPC: o servidor expõe consultas e mutações tipadas. A primeira página usa o caller do mesmo router no servidor; o navegador usa o cliente tRPC por HTTP. O Zod valida os dados na fronteira do servidor.
- Paginação: a lista usa cursor composto por data e ID para carregar mais tarefas automaticamente na rolagem. Há também um botão para carregamento manual.
- Idiomas: i18next centraliza as mensagens de interface. A escolha é guardada no navegador; português é o padrão para a primeira renderização.
- As tarefas vivem **somente na memória de um processo Node**. Reiniciar o servidor apaga todos os dados, e processos ou instâncias diferentes não compartilham a lista. Use um servidor de processo único; plataformas que criam várias funções ou instâncias, como ambientes serverless, não garantem uma lista consistente. A aplicação não tem autenticação: use apenas dados fictícios.

O código separa o router e seus testes em `server/`, a interface em `app/` e `components/`, as mensagens em `lib/i18n.ts` e o conteúdo teórico em `src/lib/theory.ts`.
