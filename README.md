# 💊 Farmácia Delivery

Um sistema Full-Stack completo de e-commerce e gestão de pedidos para farmácias. Este projeto funciona como um MVP (Minimum Viable Product) e foi projetado com uma arquitetura moderna, separando a experiência do cliente final do painel de controle administrativo, tudo alimentado por uma API RESTful robusta.

## ✨ Funcionalidades

### 🛒 Área do Cliente (Front-end: `/`)

* **Catálogo de Produtos:** Listagem de medicamentos e itens de farmácia com filtros de categoria (Dor e Febre, Gripe, Higiene, etc).
* **Carrinho de Compras Avançado:** Sistema de carrinho em etapas (Stepper) com resumo de valores, controle de quantidade e formulário de entrega.
* **Histórico de Pedidos:** Tabela responsiva com o status de pedidos anteriores do cliente.
* **Autenticação:** Sistema de login seguro com JWT, separando perfis de Cliente e Funcionário.

### 💼 Painel Administrativo (Front-end: `/pedidos-admin` & `/dashboard`)

* **Sistema Kanban de Pedidos:** Interface visual e interativa para acompanhamento do fluxo logístico (Novos Pedidos, Preparando, Saiu para Entrega, Entregue).
* **Dashboard:** Menu lateral (Sidebar) fixo para navegação rápida, otimizada para uso em computadores de balcão.

### ⚙️ API e Back-end

* **Arquitetura Limpa:** Código estruturado com separação clara de responsabilidades (`Models`, `Schemas`, `Use Cases`, `Security`).
* **Segurança:** Senhas criptografadas com Bcrypt (Passlib) e autenticação baseada em tokens JWT.
* **Validação de Dados:** Validação rigorosa de entradas (como CPF e E-mail) utilizando Pydantic.
* **Banco de Dados Relacional:** Modelagem completa usando SQLAlchemy (ORM) e PostgreSQL.

## 🚀 Tecnologias Utilizadas

### Front-end

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** CSS Modules
* **Ícones & Gráficos:** Lucide React e Recharts

### Back-end

* **Framework:** [FastAPI](https://www.google.com/search?q=https://fastapi.tiangolo.com/) (Python)
* **ORM:** SQLAlchemy
* **Validação:** Pydantic
* **Banco de Dados:** PostgreSQL
* **Segurança:** PyJWT e Passlib (Bcrypt)

## 🎨 Planejamento Visual e Funcional

### Prototipação (Baixa Fidelidade)

Esboço inicial da interface, focado na disposição dos elementos e fluxo de navegação.

### Diagrama de Caso de Uso

Interações dos atores (Cliente/Administrador) com as funcionalidades centrais do sistema.

## 💻 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

* [Node.js](https://www.google.com/search?q=https://nodejs.org/) e NPM
* [Python 3.9+](https://www.google.com/search?q=https://www.python.org/)
* [PostgreSQL](https://www.google.com/search?q=https://www.postgresql.org/) rodando localmente (ou em nuvem)

## 🛠️ Instalando e Rodando o Projeto

Clone o repositório em sua máquina:

```bash
git clone https://github.com/joaovitor-9/Delivery_Farmacia.git
cd Delivery_Farmacia

```

### 1. Configurando o Back-end (API)

Abra um terminal e navegue até a pasta do back-end:

```bash
cd Back-end

# Crie e ative o ambiente virtual
python -m venv venv

.\venv\Scripts\Activate.ps1

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor da API
uvicorn app.main:app --reload

```

### 2. Configurando o Front-end

Abra um **novo terminal** e navegue até a pasta do front-end:

```bash
cd Front-end

# Instale as dependências
npm install

# Inicie o servidor web
npm run dev

```

*Acesse `http://localhost:3000` no seu navegador para ver a interface gráfica.*

### 💼 Acesso ao Painel Administrativo

* **Usuário:** admin
* **Senha:** 123

## 🤝 Colaboradores

* [Elias Manuel Fonseca Moreira](https://github.com/elias445) - Desenvolvedor
* [João Vitor Farias de Amorim](https://github.com/joaovitor-9) - Desenvolvedor
