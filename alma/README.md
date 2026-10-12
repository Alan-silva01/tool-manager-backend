# Alma Design System (Warehouse & Industrial Sage)

[DESIGN.md](./DESIGN.md) é o documento de especificação oficial do Design System **Alma**, desenhado por **Alan Ferreira da Silva**. Combina o rigor estrutural corporativo do IBM Carbon v10 com a estética verde sálvia industrial (`#7c9c84`), tipografia IBM Plex Sans/Mono, cantos vivos, ausência de ruídos visuais e foco em operações industriais e logísticas de alta performance.

## Files

| File | Description |
|------|-------------|
| `DESIGN.md` | Documentação técnica completa das 9 seções do sistema de design |
| `preview.html` | Catálogo interativo completo com todos os componentes (Light Mode) |
| `preview-dark.html` | Catálogo interativo completo com contraste calibrado (Carbon Dark Mode) |

Use [DESIGN.md](./DESIGN.md) como referência para agentes de IA (Claude, Cursor, Antigravity) gerarem interfaces consistentes e refinadas.

## Componentes Implementados nos Previews

- **Navegação & Header**:
  - Logo e assinatura centralizados (`Alma Design System · Alan Ferreira da Silva`).
  - Topbar com botão hambúrguer para toggle lateral e dropdown rápido alinhado sem estouro de margem (`dropdown-menu-right`).
  - **Sidebar Retrátil**: menu lateral com ícones minimalistas, marcação verde ativa no clique e sincronização dinâmica via **Scrollspy** (`IntersectionObserver`).
- **Formulários & Inputs**:
  - Inputs com foco e validação de erro.
  - Dropdown `select` sob medida com seta vetorial SVG e opções estilizadas.
  - Faixa de ajuste (`range slider`) com fundo claro/destacado e contador em tempo real (`%`).
  - Dropzone pontilhado com hover sálvia para upload de arquivos.
- **Iconografia Minimalista**:
  - Grid com 8 ícones operacionais vetoriais em escala 24px (linha pura).
- **Dados & Cards**:
  - Grid de KPIs com métricas e deltas de status.
  - Highlight Card com faixa sálvia para convocações ativas.
  - Tabela com linhas zebradas em hover.
- **Overlays & Feedback**:
  - Menus dropdown, popovers, tooltips em CSS puro.
  - Modal centralizado e Drawer lateral deslizante.
  - Accordion / FAQ expansível e Stepper sequencial.
  - Toasts flutuantes com auto-dismiss.
  - **Skeleton Loading**: demonstração interativa com animação shimmer e botão para alternar entre carregamento e dados reais.

## Previews

- **Light Mode**: `open preview.html`
- **Dark Mode**: `open preview-dark.html`
