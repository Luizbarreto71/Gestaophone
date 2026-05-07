# GestaoPhone - Sistema de Controle de Estoque e B.I.

Um sistema premium de gestão de estoque e Business Intelligence desenvolvido especialmente para lojas de celulares.

## 🚀 Funcionalidades

### Dashboard de B.I. de Alta Performance
- **4 Cards de Métricas Principais:**
  - Total em Estoque (R$)
  - Vendas do Mês
  - Itens com Estoque Baixo
  - Margem de Lucro Média
- Gráfico de Área mostrando evolução das vendas semanais
- Gráfico de Pizza mostrando Giro de Estoque por marca
- Gráfico de Linha mostrando tendência mensal de receita vs custos

### Gestão de Inventário Especializada
- Tabela de produtos com filtros avançados
- Filtros por: Categoria, Marca, Condição (Novo/Seminovo), Status
- Campo obrigatório para IMEI/Número de Série
- Sistema de Tags coloridas para status (Disponível, Reservado, Vendido)
- Alertas visuais para estoque baixo

### Painel de Adição de Produtos (UX Premium)
- Modal organizado com validação de campos
- Campos: Nome, Marca, Categoria, Preço de Custo, Preço de Venda, IMEI, Quantidade Mínima
- Preview de margem de lucro em tempo real

### Outras Funcionalidades
- Gestão de Vendas
- Relatórios Analíticos
- Configurações do Sistema
- Design responsivo
- Dark Mode elegante

## 🛠️ Stack Tecnológico

- **React 19** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualização de data
- **Lucide Icons** - Ícones
- **shadcn/ui** - Componentes de UI

## 📁 Estrutura do Projeto

```
gestaophone/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Inventory.jsx
│   │   ├── Reports.jsx
│   │   ├── Sales.jsx
│   │   ├── Settings.jsx
│   │   └── Sidebar.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── lib/
│   │   └── utils.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Navegue até a pasta do projeto
cd gestaophone

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build de Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## 🎨 Design System

### Cores
- **Background:** `#0a0a0f` - Fundo principal escuro
- **Surface:** `#13131a` - Cartões e superfícies
- **Primary:** `#3b82f6` - Azul profissional (botões, destaques)
- **Accent:** `#6366f1` - Roxo para gradientes

### Tipografia
- **Fonte:** Inter (Google Fonts)
- Títulos em branco (#ffffff)
- Texto secundário em cinza (#9ca3af)

## 📊 Dados Mock

O sistema utiliza dados mockados para demonstração:
- 15 produtos de exemplo
- Histórico de vendas semanais
- Dados de giro de estoque por marca
- Tendência mensal de receita

## 🔒 Considerações de Segurança

Este é um projeto de demonstração. Para produção, considere:
- Implementar autenticação real
- Conectar a um backend/API real
- Adicionar validação server-side
- Implementar controle de acesso baseado em roles

## 📄 Licença

MIT

---

Desenvolvido com ❤️ para lojas de celulares que buscam excelência na gestão.