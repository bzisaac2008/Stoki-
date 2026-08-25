 Stoki — Sistema de Gestão de Estoque

Sistema web desenvolvido para facilitar o controle e o gerenciamento de estoque de empresas, centralizando produtos, categorias, fornecedores e movimentações em uma única aplicação.

O projeto está sendo desenvolvido como uma aplicação completa, com **Frontend em React**, **Backend em Node.js/Express** e **Supabase** como infraestrutura de dados.

---

## Sobre o projeto

O **Stoki** tem como objetivo substituir controles manuais de estoque por uma solução web simples, organizada e escalável.

A aplicação permite acompanhar os produtos cadastrados, controlar entradas e saídas, consultar categorias e fornecedores e visualizar informações importantes do estoque.

O projeto também possui planejamento para integração com **n8n**, permitindo automatizar processos e notificações.

---

## Funcionalidades

### Produtos

* Cadastro de produtos
* Edição de produtos
* Exclusão de produtos
* Consulta de produtos
* Pesquisa por nome ou categoria
* Controle de quantidade em estoque
* Definição de preço
* Associação com categoria
* Associação com fornecedor
* Identificação de estoque baixo

### Categorias

* Cadastro de categorias
* Edição de categorias
* Exclusão de categorias
* Listagem de categorias
* Seleção de categorias durante o cadastro de produtos

### Fornecedores

* Cadastro de fornecedores
* Edição de fornecedores
* Exclusão de fornecedores
* Listagem de fornecedores
* Associação de fornecedores aos produtos

### Estoque

* Entrada de produtos
* Saída de produtos
* Controle da quantidade disponível
* Histórico de movimentações
* Validação para impedir saída maior que o estoque disponível

### Dashboard

O sistema possui uma área destinada à apresentação de indicadores do estoque, como:

* Total de produtos
* Produtos em estoque
* Produtos com estoque baixo
* Produtos sem estoque
* Movimentações
* Indicadores gerais

### Automação

O projeto prevê integração com o **n8n** para automatizar processos, como:

```text
Produto com estoque baixo
          ↓
         n8n
          ↓
    Identificação
          ↓
       Alerta
          ↓
     Notificação
```

---

## Tecnologias

### Frontend

* React
* React Router
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Node.js
* Express
* JavaScript

### Banco de dados e serviços

* Supabase
* PostgreSQL

### Automação

* n8n

### Versionamento

* Git
* GitHub

---

## Arquitetura

A arquitetura planejada para o sistema segue o seguinte fluxo:

```text
                    USUÁRIO
                       │
                       ▼
              ┌─────────────────┐
              │     FRONTEND    │
              │      React      │
              └────────┬────────┘
                       │
                    HTTP/API
                       │
                       ▼
              ┌─────────────────┐
              │     BACKEND     │
              │ Node.js/Express │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │     SUPABASE    │
              │   PostgreSQL    │
              └─────────────────┘

                       │
                       ▼
                     n8n
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        Automações          Notificações
```

O **n8n não substitui o backend**. Ele será utilizado para processos automatizados e integrações.

---

## Estrutura do projeto

A estrutura planejada do repositório é:

```text
Stoki/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── routes/
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

A organização pode ser ajustada conforme a integração entre Frontend e Backend evoluir.

---

## API

O backend disponibiliza endpoints para comunicação com o frontend.

Exemplo:

```http
GET /api/produtos
```

```http
GET /api/produtos/:id
```

```http
POST /api/produtos
```

```http
PUT /api/produtos/:id
```

```http
DELETE /api/produtos/:id
```

Também existe endpoint para consulta de categorias:

```http
GET /api/categorias
```

Novos endpoints serão adicionados conforme os módulos do sistema forem integrados.

---

## Equipe

O projeto é dividido entre três responsabilidades principais.

### Desenvolvedor 1 — Frontend

Responsável por:

* Interface da aplicação
* React
* Componentes
* Layout
* Dashboard
* Produtos
* Categorias
* Fornecedores
* Movimentações
* Formulários
* Integração com a API

### Desenvolvedor 2 — Backend

Responsável por:

* Node.js
* Express
* API
* Supabase
* PostgreSQL
* Regras de negócio
* CRUDs
* Controle de estoque
* Endpoints
* Integrações

### Gestora de Projetos

Responsável por:

* Planejamento
* Requisitos
* Backlog
* Organização das tarefas
* Acompanhamento das sprints
* Critérios de aceitação
* Testes funcionais
* Registro de bugs
* Documentação
* Validação das entregas

---

## Objetivo do desenvolvimento

O projeto também tem como objetivo proporcionar uma experiência prática de desenvolvimento em equipe, utilizando um fluxo semelhante ao encontrado em equipes profissionais de software.

O processo envolve:

```text
Planejamento
     ↓
Requisitos
     ↓
Arquitetura
     ↓
Desenvolvimento
     ↓
Integração
     ↓
Testes
     ↓
Correção de bugs
     ↓
Validação
     ↓
Entrega
```

---

## Status do projeto

**Em desenvolvimento**

### Já desenvolvido

* [x] Estrutura inicial do frontend
* [x] React + Vite
* [x] React Router
* [x] App Layout
* [x] Dashboard
* [x] Tela de produtos
* [x] Tela de categorias
* [x] Tela de fornecedores
* [x] Tela de movimentações
* [x] CRUD de categorias
* [x] CRUD de fornecedores
* [x] CRUD de produtos no frontend
* [x] API inicial de produtos
* [x] API inicial de categorias
* [x] Integração inicial com Supabase
* [x] Repositório GitHub

### Em desenvolvimento

* [ ] Integração completa Frontend + Backend
* [ ] Persistência dos produtos através da API
* [ ] Integração de categorias
* [ ] API de fornecedores
* [ ] API de movimentações
* [ ] Integração do controle de estoque
* [ ] Indicadores reais do Dashboard
* [ ] Integração com n8n

### Futuro

* [ ] Autenticação
* [ ] Controle de permissões
* [ ] Notificações automáticas
* [ ] Melhorias de segurança
* [ ] Deploy da aplicação

---

## Execução local

### Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

### Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias e execute:

```bash
npm run dev
```

ou, dependendo da configuração do projeto:

```bash
npm start
```

---

## Variáveis de ambiente

As informações sensíveis do projeto **não devem ser enviadas para o GitHub**.

Exemplo:

```env
SUPABASE_URL=sua_url
SUPABASE_SECRET_KEY=sua_chave
```

O arquivo `.env` deve permanecer no `.gitignore`.

Nunca publique chaves secretas, senhas ou credenciais no repositório.

---

## Git e colaboração

Para atualizar o projeto:

```bash
git pull origin main
```

Depois das alterações:

```bash
git add .
```

```bash
git commit -m "descrição da alteração"
```

E envie para o GitHub:

```bash
git push origin main
```

Antes de realizar alterações importantes, recomenda-se verificar o estado do repositório:

```bash
git status
```

---

## Licença

Projeto desenvolvido para fins de estudo, treinamento e desenvolvimento prático em equipe.

---

## Stoki

**Sistema de Gestão de Estoque**

Organização, controle e visibilidade para o estoque da empresa.
