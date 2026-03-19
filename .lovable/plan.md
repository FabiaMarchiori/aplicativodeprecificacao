

# Refinamento Visual Premium - Dark Elegante

## Resumo
Transformar o app em uma interface dark premium com tipografia refinada, sidebar colapsavel, KPIs com bordas brancas e textos em branco puro. Apenas alteracoes visuais - zero mudancas em logica, rotas ou dados.

---

## Arquivos a Modificar

### 1. `src/index.css` - Tipografia e KPIs

**Tipografia global:**
- Atualizar `h1` para `font-size: 50px`, weight 700, cor branca pura
- Atualizar `h2` para `font-size: 28px`, weight 500, branco puro
- Atualizar `h3` (titulos de secao/cards) para `font-size: 30px`, weight 600, branco puro
- `.kpi-title`: alterar para `font-size: 23px`, weight 600, branco puro
- `.kpi-value`: alterar para `font-size: 28px`, weight 700, branco puro
- Remover todos os cinzas de textos principais - substituir por `#FFFFFF` ou `rgba(255,255,255,0.7)` para auxiliares
- Atualizar `--muted-foreground` de 55% para ~75% para textos auxiliares mais legiveis

**KPI cards - bordas brancas:**
- Substituir as bordas coloridas (cyan, green, orange, pink, purple) por `border: 1px solid rgba(255, 255, 255, 0.2)`
- Manter o glow colorido sutil no hover, mas borda base em branco
- Resultado: aparencia uniforme e premium

**Remover cinzas:**
- `.chart-container h3`: cor branca pura em vez de cyan
- `.data-table th`: cor branca pura em vez de cyan
- `.section-title`: garantir branco puro

---

### 2. `src/components/layout/Sidebar.tsx` - Sidebar Colapsavel + Premium

**Sidebar colapsavel com estado:**
- Adicionar estado `collapsed` (boolean) controlado por um callback `onToggleSidebar`
- Modo aberto: 240px, icone + texto
- Modo fechado: 84px, apenas icones centralizados
- Transicao suave com `transition-all duration-300`

**Visual premium:**
- Remover o `colorMap` multicolorido - todos os itens em branco puro
- Icones: branco puro, tamanho 22px (w-[22px] h-[22px])
- Item ativo: fundo `rgba(0, 209, 255, 0.1)`, borda sutil `rgba(0, 209, 255, 0.3)`, glow suave cyan
- Itens inativos: branco com opacidade 0.6, sem cor
- Remover inline styles coloridos dos botoes de nav
- Logo mantido com gradiente rosa/cyan
- Menu do usuario: textos em branco puro

---

### 3. `src/pages/Index.tsx` - Botao Toggle + Layout Responsivo

**Botao de toggle no topo:**
- Adicionar estado `sidebarCollapsed` no Index
- Botao 60x60px no topo esquerdo da area principal com icone Menu/PanelLeftClose
- Fundo dark discreto `rgba(255,255,255,0.05)`, borda sutil `rgba(255,255,255,0.1)`
- Hover elegante com leve glow

**Ajustar margins do main:**
- Dinamico baseado no estado collapsed: `ml-[84px]` quando fechado, `ml-[240px]` quando aberto
- Transicao suave no main tambem

---

### 4. `src/components/dashboard/KPICard.tsx` - Tipografia dos KPIs

- `.kpi-title`: aplicar `text-[23px] font-semibold text-white`
- `.kpi-value`: aplicar `text-[28px] font-bold text-white`
- Remover classes de variante colorida dos textos (manter apenas no icone/glow do card)
- Valores em branco puro com font-weight 700

---

### 5. `src/components/dashboard/Dashboard.tsx` - Titulo da Pagina

- Titulo "Dashboard": atualizar para `text-[50px] font-bold text-white` (sem textShadow exagerado)
- Remover o textShadow neon do titulo

---

## Resumo Visual Final

```text
ANTES                          DEPOIS
─────────────────────          ─────────────────────
Sidebar multicolorida    →    Sidebar monocromatica branca
Bordas KPI coloridas     →    Bordas KPI brancas uniformes
Textos cinza apagado     →    Textos branco puro
Tipografia generica      →    Tipografia com tamanhos exatos
Sidebar fixa 260px       →    Sidebar colapsavel 240/84px
Sem botao toggle         →    Botao 60x60 no topo
```

---

## Nao sera alterado
- Graficos (cores, dados, comportamento)
- Rotas e navegacao
- Logica de negocio e calculos
- Backend e dados
- Paginas Auth/Access

