# 💿 Vinyl Store

**Uma plataforma web para catálogo e gerenciamento de discos de vinil.**

O **Vinyl Store** é um projeto acadêmico desenvolvido em dupla durante o curso de **Ciência da Computação**, com o objetivo de aplicar conhecimentos de desenvolvimento web full-stack, integração entre frontend e backend, banco de dados e autenticação de usuários.

A aplicação simula uma loja virtual especializada em discos de vinil, oferecendo um catálogo público para visitantes e uma área administrativa para o gerenciamento das informações cadastradas.

> **Projeto acadêmico:** desenvolvido para fins de aprendizado e demonstração de conhecimentos em desenvolvimento de software. Não se trata de uma loja comercial em operação.

---

## Tecnologias utilizadas

### Frontend
- **Next.js** — framework React para desenvolvimento da interface.
- **React** — criação de componentes e interfaces interativas.
- **TypeScript** — tipagem estática e organização do código.
- **CSS Modules** — estilização modular dos componentes.

### Backend
- **NestJS** — framework Node.js para desenvolvimento da API.
- **TypeScript** — linguagem utilizada na implementação.
- **Prisma ORM** — modelagem e acesso ao banco de dados.
- **SQLite** — banco de dados relacional.
- **JWT** — autenticação e proteção de rotas.
- **bcrypt** — geração e verificação de hashes de senhas.

---

## Funcionalidades

### Área pública
- Visualização do catálogo de discos de vinil.
- Pesquisa por álbum e artista.
- Filtragem por gênero musical.
- Exibição de informações como preço, ano de lançamento, estado de conservação, velocidade RPM e disponibilidade.
- Interface responsiva para diferentes tamanhos de tela.
- Autenticação de usuários.

### Área administrativa
- Cadastro, edição e exclusão de discos de vinil.
- Gerenciamento de artistas e gêneros musicais.
- Administração de usuários e perfis.
- Controle de estoque dos produtos.
- Associação de capas aos álbuns.
- Proteção de rotas por autenticação e permissões.

---

## Estrutura do projeto

O projeto é dividido em duas aplicações independentes:

```text
vinyl-store/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── frontapp/
│   ├── app/
│   ├── public/
│   │   └── images/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

O **frontend** é responsável pela experiência visual e interação com os usuários, enquanto o **backend** fornece a API REST, executa as regras de negócio e realiza a comunicação com o banco de dados.

---

## Como executar localmente

### Pré-requisitos

- Node.js
- npm
- Git

Não é necessário instalar um servidor de banco de dados separadamente, pois o projeto utiliza SQLite.

### 1. Clonar o repositório

```bash
git clone [https://github.com/diweiskt/projeto-ecommerce-Vinil.git](https://github.com/diweiskt/projeto-ecommerce-Vinil.git)
cd projeto-ecommerce-Vinil
```

### 2. Configurar o backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` a partir do `.env.example` e configure as variáveis necessárias:

```dotenv
DATABASE_URL="file:./dev.db"
JWT_SECRET="configure-uma-chave-segura"
ADMIN_EMAIL="admin@exemplo.com"
ADMIN_PASSWORD="configure-uma-senha-segura"
PORT=3000
```

As credenciais acima são apenas exemplos. Defina valores próprios antes de executar o projeto.

### 3. Preparar o banco de dados

Gere o cliente Prisma:

```bash
npx prisma generate
```

Aplique as migrações:

```bash
npx prisma migrate dev
```

Execute o script de dados iniciais:

```bash
node prisma/seed.js
```

O seed cadastra gêneros musicais, artistas e discos de demonstração. Se configurado para criar o administrador por variáveis de ambiente, essas variáveis precisam estar disponíveis durante sua execução.

### 4. Iniciar o backend

```bash
npm run start:dev
```

Por padrão, a API é executada em:

`http://localhost:3000/api`

### 5. Configurar e iniciar o frontend

Em outro terminal, acesse a pasta do frontend:

```bash
cd frontapp
npm install
```

Crie um arquivo `.env.local` com o endereço da API:

```dotenv
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Inicie a aplicação:

```bash
npm run dev
```

Acesse no navegador:

**http://localhost:3001**

---

## Banco de dados

O projeto utiliza **Prisma ORM** com **SQLite** para armazenar informações relacionadas a:

- Usuários e perfis.
- Discos de vinil.
- Artistas.
- Gêneros musicais.

As migrações permitem reproduzir a estrutura do banco em outro ambiente. O script `seed.js` disponibiliza registros iniciais para testes e demonstração.

---

## Autenticação e autorização

O backend implementa autenticação utilizando **JWT (JSON Web Token)** e armazenamento de senhas por meio de hashes.

As rotas administrativas são protegidas por mecanismos de autenticação e controle de permissões, permitindo separar funcionalidades públicas de operações restritas aos administradores.

---

## Objetivo acadêmico

O desenvolvimento do Vinyl Store permitiu aplicar, de forma prática, conceitos estudados durante a graduação, incluindo:

- Arquitetura frontend e backend.
- Desenvolvimento de APIs REST.
- Componentização de interfaces.
- Modelagem de banco de dados relacional.
- Operações CRUD.
- Autenticação e autorização.
- Integração entre diferentes tecnologias.
- Organização e manutenção de código.

O projeto também proporcionou experiência com desenvolvimento colaborativo e divisão de responsabilidades.

---

## Desenvolvedores

Projeto desenvolvido em dupla por estudantes de Ciência da Computação:

**Diwei Victor Nicolay**  
GitHub: [@diweiskt](https://github.com/diweiskt)

**Henrique Prediger**  
GitHub: [@HPrediger](https://github.com/HPrediger)

---

## Status

**Projeto acadêmico desenvolvido — preparação para publicação online.**

O Vinyl Store foi criado para estudos e demonstração no portfólio dos desenvolvedores. Funcionalidades comerciais, como pagamentos e processamento de pedidos reais, não fazem parte do objetivo atual do projeto.