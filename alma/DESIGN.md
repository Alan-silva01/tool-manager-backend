# Design System Inspiration of Alma

**Autor**: Alan Ferreira da Silva  
**Inspiração Base**: IBM Carbon Design System v10 & Alma Industrial Architecture  
**Cor de Destaque**: Verde Sálvia Industrial (`#7c9c84`)

---

## 1. Visual Theme & Atmosphere

O **Alma** é um design system voltado para alta precisão operacional, ambientes industriais e corporativos de missão crítica. Sua identidade visual é construída sobre linhas afiadas com cantos retos (`border-radius: 0px` ou `2px`), ausência de sombras difusas e uma rígida proporção 60-30-10:

- **60% (Superfície)**: Canvas neutro claro (`#f4f4f4` e `#ffffff`) no modo Light, ou grafite profundo Carbon (`#161616` e `#212121`) no modo Dark.
- **30% (Estrutura)**: Topbar escuro (`#121212`), divisores hairline sutis de 1px (`#e0e0e0` / `#333333`) e textos de apoio em escala de cinzas.
- **10% (Ponto Focal)**: Cor institucional Verde Sálvia (`#7c9c84`), reservada estritamente para ações primárias, estados ativos e molduras de destaque.

A tipografia é baseada no par oficial do IBM Carbon: **IBM Plex Sans** para títulos, labels e parágrafos, e **IBM Plex Mono** com numerais tabulares (`tabular-nums`) para senhas, códigos de requisição, horários e dados numéricos.

---

## 2. Color Palette & Roles

### Brand & Primary Accent
- **Sage Primary** (`#7c9c84`): Cor central de destaque — botões de ação principal, abas ativas, bordas de convocação.
- **Sage Hover** (`#6c8c74`): Estado `:hover` de interações primárias.
- **Sage Active** (`#5c7b64`): Estado `:active` / pressionado.
- **Sage Tint Light** (`#edf3ef`): Fundo suave de cards em destaque e badges leves no tema claro.
- **Sage Tint Dark** (`#1b261f`): Fundo translúcido para badges no tema escuro.
- **Sage Border** (`#c4d7cb` / `#354a3b`): Contorno de caixas com tema ativo.

### Background Surfaces (Light Mode)
- **Canvas Page** (`#f4f4f4`): Fundo geral da aplicação.
- **Surface Card** (`#ffffff`): Fundo de painéis principais, tabelas e abas ativas.
- **Header Dark** (`#161616`): Top header bar com contraste forte.
- **Header Surface** (`#262626`): Hover e caixas de status dentro do header.

### Background Surfaces (Dark Mode)
- **Dark Canvas** (`#161616`): Fundo base da página no modo escuro.
- **Dark Surface** (`#212121`): Fundo de cards, painéis e formulários.
- **Dark Header** (`#121212`): Top header bar escuro puro.
- **Dark Border** (`#333333`): Divisores estruturais suaves.

### Text & Content
- **Text Primary** (`#161616` light / `#f4f4f4` dark): Títulos, dados principais, nomes.
- **Text Secondary** (`#525252` light / `#a8a8a8` dark): Subtítulos, labels descritivas e textos de apoio.
- **Text Muted** (`#8d8d8d` light / `#757575` dark): Placeholders, metadados secundários e carimbos de tempo.
- **Text Inverse** (`#ffffff`): Textos em botões escuros ou fundos primários.

### Status & Feedback
- **Success** (`#25a244` light / `#42be65` dark): Conclusões de fluxo, status positivo.
- **Danger** (`#da1e28` light / `#fa4d56` dark): Ações destrutivas, alertas críticos e cancelamentos.
- **Warning** (`#f1c21b`): Atenção e itens abaixo do estoque mínimo.
- **Info** (`#0f62fe` light / `#4589ff` dark): Notificações e metadados informativos.

---

## 3. Typography Rules

### Font Families
- **Sans-Serif**: `'IBM Plex Sans', -apple-system, system-ui, sans-serif`
- **Monospace**: `'IBM Plex Mono', Menlo, Consolas, monospace`

### Escala Tipográfica

| Nível / Papel | Fonte | Tamanho | Peso (Weight) | Tracking | Line Height |
|---------------|-------|---------|---------------|----------|-------------|
| Display Hero | IBM Plex Sans | 48px–64px | 700–800 | -0.02em | 1.10 |
| Heading 1 | IBM Plex Sans | 28px–32px | 700 | -0.015em | 1.20 |
| Heading 2 | IBM Plex Sans | 22px–24px | 600 | -0.01em | 1.25 |
| Heading 3 | IBM Plex Sans | 16px–18px | 600 | Normal | 1.30 |
| Body Text | IBM Plex Sans | 13px–14px | 400 | Normal | 1.50 |
| Caption / Meta | IBM Plex Sans | 11px–12px | 400 | Normal | 1.40 |
| Overline | IBM Plex Sans | 11px | 700 | +0.10em | 1.00 |
| Mono Data / Code | IBM Plex Mono | 12px–13px | 500–600 | +0.02em | 1.00 |

---

## 4. Buttons & Actions

- **Primary Button**: Fundo `--color-primary` (`#7c9c84`), texto `#ffffff`, sem raio de curvatura (`border-radius: 0px`).
- **Secondary Button**: Fundo `--color-dark-border` (`#393939`), texto `#ffffff`.
- **Dark Button**: Fundo `#161616`, texto `#ffffff`.
- **Ghost Button**: Fundo transparente, texto `--color-primary-active`.
- **Danger Button**: Fundo `#da1e28`, texto `#ffffff`.
- **Disabled Button**: Fundo `#e0e0e0` (light) ou `#2a2a2a` (dark), texto atenuado, cursor `not-allowed`.

---

## 5. Forms & Inputs

- **Estilo Signature Carbon**: Inputs e selects possuem preenchimento neutro e linha inferior sólida de 2px (`border-bottom: 2px solid #161616`).
- **Estado de Foco**: Ao receber foco, a linha inferior transiciona para `--color-primary` (`#7c9c84`).
- **Validação de Erro**: Linha inferior transiciona para `--color-danger` (`#da1e28`).
- **Select Customizado**: Arrow vetorial embutido via SVG data-URI, sem bordas padrão do sistema operacional, com opções estilizadas.
- **Faixa de Ajuste (Range Slider)**: Container com fundo claro destacado (`#f7f7f7` / `#212121`), trilho limpo de 6px, thumb circular sálvia de 18px e mostrador numérico em tempo real.

---

## 6. Containers, Cards, Icons & Tables

- **Cards Sharp**: Bordas de 1px hairline em `#e0e0e0` / `#333333`, cantos retos.
- **Card Highlight**: Borda sólida de 2px a 3px em `#7c9c84` com faixa superior sólida.
- **Tabelas**: Linhas limpas com separador de 1px e efeito de hover sutil.
- **KPIs**: Cards com indicador superior de 3px na cor sálvia e tipografia mono display para valores.
- **Iconografia Minimalista (24px)**: Grid de ícones vetoriais de linha pura (stroke: 2px, cantos arredondados) projetados para operações corporativas (Dashboard, Estoque, Usuário, Alerta, Requisição, Busca, Ajustes).

---

## 7. Navigation & Overlays

- **Header Topbar**: Logo `Alma Design System` com assinatura centralizada em display absoluto e dropdown rápido alinhado à direita (`dropdown-menu-right`).
- **Sidebar Retrátil**: Menu vertical de 250px com recolhimento animado via botão hambúrguer, ícones minimalistas, marcação verde ativa no clique e sincronização em tempo real via **Scrollspy** (`IntersectionObserver`).
- **Tabs Horizontais**: Abas conectadas com sublinhado de 2px na cor institucional.
- **Modais**: Janela centralizada com cabeçalho escuro `#161616` e backdrop fosco.
- **Drawer**: Painel lateral deslizante com animação suave da direita.

---

## 8. Feedback, Loaders & Motion

- **Alertas**: Faixa com borda lateral de 4px colorida pelo token semântico.
- **Toasts**: Notificações flutuantes no canto inferior direito com auto-dismiss em 4 segundos.
- **Skeleton Loading (Shimmer)**: Efeito de carregamento com gradiente horizontal animado contínuo (`skeleton-shimmer` de 1.4s), cobrindo placeholders de avatar circular e blocos de texto para mitigar percepção de latência.
- **Transições**: Duração rápida padrão de `0.15s` a `0.25s` para sensação de alta performance.

---

## 9. Audio & Microinteractions

- **Chime Tri-tom (Web Audio API)**: Frequências 523.25 Hz (C5), 659.25 Hz (E5) e 783.99 Hz (G5) para notificações acústicas formais.
- **Síntese de Voz (Web Speech API)**: Anúncios cadenciados nativos do navegador com taxa de velocidade `0.95`.
