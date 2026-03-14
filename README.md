# DevRoast

> Uma plataforma para avaliar e "assar" seu código com críticas honestas e divertidas.

![DevRoast](https://img.shields.io/badge/Next.js-16-blue?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-blue?style=flat-square&logo=tailwind-css)

## Sobre

O **DevRoast** é uma aplicação web desenvolvida durante o **NLW (Next Level Week)** da **Rocketseat**. O projeto nasceu das aulas do evento, onde construímos uma plataforma completa para desenvolvedores avaliarem e melhorarem seu código.

A ideia é simples: cole seu código e receba uma análise honesta ("roast") sobre a qualidade, boas práticas e oportunidades de melhoria. É o lugar perfeito para quem quer aprender com críticas construtivas (e um pouco de sarcasmo).

## Funcionalidades

### 🚀 Homepage
- **Editor de Código:** Área para colar e visualizar seu código
- **Toggle de Modo:** Ative o "Roast Mode" para receber análises mais... diretas
- **Estatísticas:** Veja quantos códigos já foram "assados" e a média de notas
- **Leaderboard:** Confira os piores códigos da internet (ranking de shame)

### 🎨 Página de Componentes
- **Galeria de UI:** Visualize todos os componentes de interface utilizados
- **Documentação Interativa:** Veja as variantes e estados de cada componente
- **Exemplos Práticos:** Como usar cada componente no seu projeto

### 🏆 Leaderboard
- **Ranking de Códigos:** Veja os piores códigos avaliados pela comunidade
- **Detalhes:** Linguagem, pontuação e snippet do código
- **Acesso Rápido:** Navegue entre os melhores (ou piores) códigos

## Tecnologias Utilizadas

- **Next.js 16:** Framework React para aplicações full-stack
- **TypeScript:** Para tipagem estática e melhor desenvolvimento
- **Tailwind CSS:** Framework de estilização utility-first
- **Shiki:** Syntax highlighting para blocos de código

## Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone <repositorio>
   cd devroast
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:3000
   ```

### Build para Produção

```bash
npm run build
npm start
```

## Estrutura do Projeto

```
src/
├── app/                    # Rotas da aplicação
│   ├── page.tsx           # Homepage
│   ├── componentes/       # Página de componentes
│   └── leaderboard/       # Página do ranking
├── components/
│   └── ui/                # Componentes de interface
│       ├── button.tsx
│       ├── badge.tsx
│       ├── toggle.tsx
│       ├── card.tsx
│       ├── navbar.tsx
│       ├── code-block.tsx
│       └── score-ring.tsx
└── styles/                # Estilos globais
```

## Padrões de Componentes

Todos os componentes seguem o **pattern de composição** (sub-componentes):

```tsx
// Exemplo: Button
<Button.Default>Texto</Button.Default>
<Button.Destructive>Excluir</Button.Destructive>
<Button.Lg>Grande</Button.Lg>

// Exemplo: Toggle
<Toggle.Root checked={true} onCheckedChange={setChecked}>
  <Toggle.Switch />
  <Toggle.Text>
    <Toggle.Label>Modo Roast</Toggle.Label>
    <Toggle.Description>Análise direta</Toggle.Description>
  </Toggle.Text>
</Toggle.Root>
```

## Contribuição

Este projeto foi desenvolvido durante o **NLW da Rocketseat**. Sinta-se livre para:
- Abri issues para reportar bugs
- Sugerir melhorias
- Enviar pull requests

## License

MIT License - Sinta-se livre para usar como quiser!

---

Desenvolvido com ❤️ durante o **NLW da Rocketseat** 🚀
