# Padrão de Estrutura — Projetos HTML / CSS / JS

Este documento descreve as convenções utilizadas na construção dos projetos web (HTML, CSS e JS), servindo como referência para manter consistência entre páginas e novos projetos.

---

## 1. Estrutura de Pastas

```
projeto/
├── index.html
├── pages/
│   ├── home.html
│   ├── services.html
│   └── ...
├── assets/
│   ├── fonts/
│   ├── img/
│   └── icons/
├── css/
│   ├── main.css        # estilos globais (header, footer, botões, reset, variáveis)
│   ├── home.css        # estilos específicos da página Home
│   ├── services.css     # estilos específicos da página Services
│   └── ...
└── js/
    ├── main.js          # lógica global (componentes reaproveitáveis)
    ├── home.js
    ├── services.js
    └── ...
```

---

## 2. CSS

### 2.1 Fontes locais (sem CDN)

Todas as fontes são carregadas localmente via `@font-face`, em formato `.woff2`, definindo os pesos e estilos necessários:

```css
@font-face {
  font-family: "JetBrains Mono";
  src: url("/assets/fonts/JetBrainsMono-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### 2.2 Variáveis globais (`:root`)

Cores, fontes, tamanhos e demais valores reutilizáveis ficam centralizados em variáveis CSS, dentro de `main.css`:

```css
:root {
  /* Cores principais */
  --primary: #0026b8;
  --primary-dim: #0f3fd1;
  --gradient: linear-gradient(90deg, #0026b8 0%, #1a3fd6 50%, #0f3fd1 100%);
  --background-1: rgb(248, 248, 255);
  --background-2: rgb(240, 240, 248);
  --border-1: #cdcdcd;
  --border-2: #6b6b6b;
  --white: #ffffff;
  --black: #000000;

  /* Cores semânticas de texto */
  --text-heading: var(--black);
  --text-body: var(--border-2);
  --text-highlight: var(--primary);
  --text-inverse: var(--white);

  /* Fontes */
  --font-header: "JetBrains Mono", monospace;
  --font-body: sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Layout */
  --header-height: 70px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2.3 Unidades

- **Sempre `px`** para tamanhos (fontes, espaçamentos, larguras, alturas, etc.).
- Não usar `rem`, `em`, `%` ou outras unidades relativas, exceto quando estritamente necessário (ex: `vw`/`vh` para elementos full-screen).

### 2.4 Reset e Base

Todo projeto começa com um reset básico e definições gerais no `main.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  background-color: var(--background-1);
  color: var(--text-body);
  font-family: var(--font-body);
  line-height: 1.6;
  overflow-x: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--text-heading);
  font-family: var(--font-header);
}
```

### 2.5 Organização por Seções

O CSS é dividido em blocos, cada um representando uma seção da página, separados por comentários padronizados:

```css
/*================================  */
/*================================  */
/* ====== HERO SECTION ============ */
/*================================  */
/*================================ */

/* estilos mobile da seção */
```

### 2.6 Mobile First

Todo o CSS é escrito **mobile first**. Os estilos de desktop ficam **dentro do mesmo bloco da seção**, em um sub-bloco próprio, identificado com `DESKTOP`:

```css
/*================================  */
/*================================  */
/* ====== HERO SECTION ============ */
/*================================  */
/*================================ */

/* estilos mobile */

/*================================ */
/* ====== HERO SECTION DESKTOP === */
/*================================ */
/*================================ */

@media (min-width: 768px) {
  /* estilos desktop */
}
```

### 2.7 Divisão de Arquivos CSS

- **`main.css`**: estilos globais e compartilhados entre páginas — variáveis, fontes, reset, header, footer, botões, componentes reutilizáveis.
- **Um arquivo por página**: cada página tem seu próprio CSS (`home.css`, `services.css`, `about.css`, etc.), contendo apenas os estilos específicos daquela página, organizados por seção conforme o padrão acima.

---

## 3. JavaScript

- Escrito em **POO (Programação Orientada a Objetos)**, com componentes encapsulados em classes para facilitar reaproveitamento entre páginas/projetos.
- **`main.js`**: contém os componentes globais reaproveitáveis (ex: menu mobile, header sticky, modais, sliders genéricos).
- **Um arquivo por página**: lógica específica de cada página (`home.js`, `services.js`, etc.).
- O código também é dividido em blocos por seção/componente, seguindo o mesmo padrão de comentários do CSS:

```js
/*================================  */
/*================================  */
/* ====== HEADER COMPONENT ======== */
/*================================  */
/*================================ */

class Header {
  constructor() {
    // ...
  }
}
```

---

## 4. Ícones

- **Não usar bibliotecas de ícones via classe/CDN**, como Font Awesome (`<i class="fa-brands ...">`, `<i class="fa-solid ...">`, etc.).
- Ícones devem ser **SVG** inline ou importados como arquivos `.svg`, mantendo o projeto independente de CDNs externos e permitindo estilização direta via CSS (`fill`, `stroke`, `currentColor`, etc.).

```html
<!-- Errado -->
<i class="fa-brands fa-whatsapp"></i>

<!-- Correto -->
<svg class="icon icon-whatsapp" viewBox="0 0 24 24" fill="currentColor">
  <path d="..." />
</svg>
```

---

## 5. HTML

- Cada seção da página é delimitada por blocos de comentário, seguindo o mesmo padrão visual do CSS/JS:

```html
<!--================================  -->
<!--================================  -->
<!-- ====== HERO SECTION ============ -->
<!--================================  -->
<!--================================ -->

<section class="hero">...</section>
```

- Estrutura semântica (`header`, `main`, `section`, `footer`, etc.) sempre priorizada.

---

## 6. Resumo Rápido

| Item                    | Padrão                                                         |
| ----------------------- | -------------------------------------------------------------- |
| Fontes                  | Locais (`.woff2`, via `@font-face`)                            |
| Unidades                | Sempre `px`                                                    |
| Variáveis               | Cores, fontes, tamanhos no `:root` em `main.css`               |
| Organização CSS/JS/HTML | Blocos por seção, separados por comentários                    |
| Responsividade          | Mobile first, desktop dentro do bloco da seção                 |
| Ícones                  | SVG (nunca Font Awesome / `<i class="fa-...">`)                |
| CSS                     | `main.css` (global) + 1 arquivo por página                     |
| JS                      | POO, componentizado, `main.js` (global) + 1 arquivo por página |
