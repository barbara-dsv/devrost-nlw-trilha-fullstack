"use client";

import { Badge, Button, Card, CodeBlock, Navbar, ScoreRing, Toggle } from "@/components/ui";
import { useState } from "react";

export default function ComponentesPage() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(true);
  const [toggle4, setToggle4] = useState(false);
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Componentes de UI
          </h1>
          <p className="text-lg text-muted-foreground">
            Página de exemplos para visualizar todos os componentes de UI com
            suas variantes.
          </p>
        </header>

        {/* Navbar */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Navbar
          </h2>
          <p className="text-muted-foreground mb-6">
            Barra de navegação superior com links.
          </p>
          <Navbar.Root>
            <Navbar.Brand>
              <span className="font-bold">MyApp</span>
            </Navbar.Brand>
            <Navbar.Nav>
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="/componentes" className="text-muted-foreground hover:text-foreground transition-colors">
                Componentes
              </a>
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </a>
            </Navbar.Nav>
          </Navbar.Root>
        </section>

        {/* Botões */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Button
          </h2>
          <p className="text-muted-foreground mb-6">
            Componente Button com variantes e tamanhos diferentes.
          </p>

          {/* Variantes */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Variantes
            </h3>
            <div className="flex flex-wrap gap-4 p-6 bg-muted/50 rounded-lg">
              <Button.Default>Default</Button.Default>
              <Button.Destructive>Destructive</Button.Destructive>
              <Button.Outline>Outline</Button.Outline>
              <Button.Secondary>Secondary</Button.Secondary>
              <Button.Ghost>Ghost</Button.Ghost>
              <Button.Link>Link</Button.Link>
            </div>
          </div>

          {/* Tamanhos */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Tamanhos
            </h3>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-muted/50 rounded-lg">
              <Button.Sm>Small</Button.Sm>
              <Button.Root>Default</Button.Root>
              <Button.Lg>Large</Button.Lg>
              <Button.Icon>⚡</Button.Icon>
            </div>
          </div>
        </section>

        {/* Badge */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Badge</h2>
          <p className="text-muted-foreground mb-6">
            Elemento de status ou categoria.
          </p>
          <div className="flex flex-wrap gap-4 p-6 bg-muted/50 rounded-lg">
            <Badge.Default>Default</Badge.Default>
            <Badge.Secondary>Secondary</Badge.Secondary>
            <Badge.Destructive>Destructive</Badge.Destructive>
            <Badge.Outline>Outline</Badge.Outline>
            <Badge.Success>Success</Badge.Success>
            <Badge.Warning>Warning</Badge.Warning>
            <Badge.Critical>Critical</Badge.Critical>
          </div>
        </section>

        {/* Toggle */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Toggle
          </h2>
          <p className="text-muted-foreground mb-6">
            Switch para alternar entre estados ligado/desligado.
          </p>
          <div className="flex flex-wrap gap-8 p-6 bg-muted/50 rounded-lg items-center">
            {/* Toggle 1: Ligado sem label */}
            <Toggle.Root checked={toggle1} onCheckedChange={setToggle1}>
              <Toggle.Switch />
            </Toggle.Root>

            {/* Toggle 2: Desligado sem label */}
            <Toggle.Root checked={toggle2} onCheckedChange={setToggle2}>
              <Toggle.Switch />
            </Toggle.Root>

            {/* Toggle 3: Ligado com label e description */}
            <Toggle.Root checked={toggle3} onCheckedChange={setToggle3}>
              <Toggle.Switch />
              <Toggle.Text>
                <Toggle.Label>Com label</Toggle.Label>
                <Toggle.Description>Descrição do toggle</Toggle.Description>
              </Toggle.Text>
            </Toggle.Root>

            {/* Toggle 4: Desligado com label e description */}
            <Toggle.Root checked={toggle4} onCheckedChange={setToggle4}>
              <Toggle.Switch />
              <Toggle.Text>
                <Toggle.Label>Desligado com label</Toggle.Label>
                <Toggle.Description>Descrição do toggle</Toggle.Description>
              </Toggle.Text>
            </Toggle.Root>
          </div>
        </section>

        {/* Card */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Card</h2>
          <p className="text-muted-foreground mb-6">
            Container de conteúdo com estilos.
          </p>
          <Card.Root>
            <Card.Header>
              <Card.Title>Análise de Código</Card.Title>
              <Card.Description>
                Identificamos problemas no seu código e sugerimos melhorias.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-sm text-muted-foreground">
                Mais detalhes sobre a análise...
              </p>
            </Card.Content>
          </Card.Root>
        </section>

        {/* CodeBlock */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            CodeBlock
          </h2>
          <p className="text-muted-foreground mb-6">
            Bloco de código com syntax highlighting usando Shiki.
          </p>
          <CodeBlock.Root>
            <CodeBlock.Header>
              <span className="text-sm text-muted-foreground">utils.js</span>
            </CodeBlock.Header>
            <CodeBlock.Body html="<code>const x = 1;</code>" />
          </CodeBlock.Root>
        </section>

        {/* ScoreRing */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            ScoreRing
          </h2>
          <p className="text-muted-foreground mb-6">
            Anel de pontuação com gradiente de cores.
          </p>
          <div className="flex flex-wrap gap-8 p-6 bg-muted/50 rounded-lg items-center justify-center">
            <ScoreRing.Root score={3.5} />
            <ScoreRing.Root score={7.2} maxScore={10} />
            <ScoreRing.Root score={5} maxScore={10} size={120} strokeWidth={3} />
          </div>
        </section>

        {/* Seção de componentes futuros */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Em Breve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Input
              </h3>
              <p className="text-muted-foreground text-sm">
                Campo de entrada de texto com variantes.
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Table
              </h3>
              <p className="text-muted-foreground text-sm">
                Tabela de dados com linhas e células.
              </p>
            </div>
          </div>
        </section>

        {/* Link de volta */}
        <footer className="pt-8 border-t border-border">
          <a
            href="/"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            ← Voltar para a página inicial
          </a>
        </footer>
      </div>
    </div>
  );
}
