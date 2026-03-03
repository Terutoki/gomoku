# AGENTS.md - Development Guidelines for Gomoku Project

## Project Overview

This is a simple static web project containing:
- **game.js** - Gomoku (Five-in-a-row) game with JavaScript AI
- **index.html** - Game UI
- **style.css** - Game styles
- **blog.html** - Personal blog page (HTML/Tailwind)
- **library.html** - Online library landing page (HTML/Tailwind)

No build system, tests, or linting configured. Pure static HTML/CSS/JS files.

---

## Build / Run Commands

### Running the Project

Since this is a static site, simply open HTML files in a browser:

```bash
# Open in default browser
open index.html
open blog.html
open library.html

# Or use a simple HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### No Build System

This project does NOT use:
- No npm / package.json
- No tests (Jest, Vitest, etc.)
- No linting (ESLint, Prettier)
- No TypeScript

For blog.html and library.html, they use Tailwind CSS via CDN.

---

## Code Style Guidelines

### JavaScript (game.js)

#### Naming Conventions
- **Constants**: UPPER_SNAKE_CASE (e.g., `BOARD_SIZE`, `EMPTY`)
- **Variables/functions**: camelCase (e.g., `initBoard`, `handleClick`)
- **DOM elements**: camelCase with descriptive names (e.g., `boardElement`, `statusElement`)

#### Functions
```javascript
// Good: Descriptive names, clear purpose
function evaluatePosition(row, col, player) { ... }
function checkWin(row, col, player) { ... }

// Bad: Unclear abbreviations
function evl(r, c, p) { ... }
```

#### Code Structure
- Use const/let, avoid var
- Use arrow functions for callbacks
- Keep functions focused (single responsibility)
- Use early returns to reduce nesting

#### Error Handling
- Validate inputs at function boundaries
- Check array bounds before accessing
- Handle null/undefined cases explicitly

```javascript
// Good
if (!board || row < 0 || row >= BOARD_SIZE) return;

// Bad
if (board[row][col] === EMPTY) { ... }
```

#### Comments
- Comment complex logic (AI algorithms, win detection)
- Use Chinese comments since project is Chinese-focused
- Avoid obvious comments

---

### HTML

#### Structure
- Use semantic HTML5 elements (nav, section, article, footer)
- Include viewport meta tag for responsiveness
- Use accessible attributes (alt, aria-label, for)

```html
<!-- Good -->
<button aria-label="关闭弹窗">X</button>
<img src="cover.jpg" alt="书籍封面">

<!-- Bad -->
<button>X</button>
<img src="cover.jpg">
```

#### Forms
- Always include labels
- Use appropriate input types (email, tel, etc.)
- Include required attribute validation

---

### CSS (style.css)

#### Naming
- Use BEM-like naming or simple descriptive class names
- Avoid overly generic names

```css
/* Good */
.board {}
.cell {}
.piece.black {}

/* Avoid */
.box {}
.item {}
```

#### Properties
- Use flexbox and grid for layout
- Include mobile-first media queries
- Use CSS custom properties for colors

```css
/* Good: Mobile-first */
.cell { width: 30px; height: 30px; }
@media (min-width: 768px) {
    .cell { width: 40px; height: 40px; }
}
```

#### Responsive
- Test at 375px, 768px, 1024px, 1440px
- Use relative units (rem, em, %, vw/vh)

---

### General Guidelines

#### Accessibility (Critical Priority)
- **Color contrast**: Minimum 4.5:1 for text
- **Focus states**: Visible focus rings on interactive elements
- **Touch targets**: Minimum 44x44px
- **Keyboard navigation**: Logical tab order

```css
/* Good: Visible focus */
button:focus {
    outline: 2px solid #primary;
    outline-offset: 2px;
}
```

#### Performance
- Use transform/opacity for animations, not width/height
- Lazy load images when possible
- Check prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
    * { animation: none !important; }
}
```

#### Icons
- Use SVG icons, NOT emojis as UI icons
- Be consistent with icon library

---

## File Organization

```
/project-root
├── index.html          # Main game
├── game.js             # Game logic
├── style.css           # Game styles
├── blog.html           # Blog page
├── library.html        # Library page
├── AGENTS.md           # This file
└── .agents/            # Skill files (do not modify)
```

---

## Adding New Features

### For Game (game.js)
1. Add constants at top of file
2. Implement functions with clear names
3. Test game logic manually
4. Add responsive handling for new UI elements

### For Blog/Library Pages
1. Maintain consistent styling with existing pages
2. Use same Tailwind classes patterns
3. Include all accessibility attributes

---

## Notes for AI Agents

- This is a simple project - no complex tooling required
- Manually test HTML/CSS/JS changes in browser
- No automated testing - verify visually
- Chinese language content is expected
- Keep code clean and readable for future maintenance
