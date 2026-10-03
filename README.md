# DoAide Flash

Free flashcard study tool at [flash.doaide.com](https://flash.doaide.com).

## Features

- **Create Decks** — Title, description, tags
- **Add Cards** — Front/back text, images, categories
- **Study Mode** — Flip cards with spacebar/click, mark known/unknown
- **Spaced Repetition** — SM-2 algorithm for optimal review scheduling
- **Quiz Mode** — Multiple choice generated from deck, score tracking
- **Import/Export** — CSV import, JSON export/import, share decks via URL
- **10 Pre-made Decks** — GK India, World Capitals, English Vocabulary, Math Formulas, Science Facts, Hindi-English, Programming Terms, History Dates, Geography, Current Affairs
- **Stats** — Cards studied, accuracy, streak, study time
- **Themes** — Light/Dark mode
- **Card Animations** — Smooth 3D flip animation

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3.4
- localStorage for persistence (no backend)

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

### Server Deployment

```bash
# Copy to server
scp -r dist/ root@89.167.8.178:/opt/DoAide-Flash/dist/
scp doaide-flash.service root@89.167.8.178:/etc/systemd/system/

# On server
systemctl daemon-reload
systemctl enable doaide-flash
systemctl start doaide-flash
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Flip card |
| Arrow Right | Mark as known |
| Arrow Left | Mark as unknown |
| 1-4 | Select quiz answer |

## License

Proprietary - DoAide
