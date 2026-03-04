# Singularity AI Club Website

Modern, interactive website for the University of Waikato AI Club.

## Features

- **Responsive Design**: Works on all devices with a beautiful dark theme
- **Interactive Elements**:
  - Animated particle background
  - Live event countdown timer
  - Forum/discussion board with localStorage persistence
  - Smooth scroll navigation
  - Glassmorphism cards with hover effects
- **Sections**:
  - Hero with call-to-action
  - About (Learn, Build, Connect)
  - Projects showcase with status badges
  - Events with schedule and countdown
  - Instagram feed integration
  - Discussion forum
  - Join membership call-to-action
  - Resources library
  - Team member profiles
  - Contact form
- **Tech Stack**: React 18, Framer Motion, Lucide Icons, Vite

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### Build for Production
```bash
npm run build
```
Output goes to `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## Deploy to GitHub Pages

1. Create a repository named `singularityai.github.io` on GitHub
2. Push this code to the main branch
3. In repository settings, enable GitHub Pages:
   - Source: Deploy from a branch
   - Branch: main (or gh-pages if you prefer)
   - Folder: / (root) if using main, or /docs if using gh-pages
4. Alternatively, use the built-in Vite GitHub Pages deployment:

Add to `vite.config.js`:
```js
base: '/singularityai.github.io/'
```

Then commit and push. GitHub Pages will automatically deploy the `dist/` folder if you set up GitHub Actions or manually push the built files.

### Manual Deploy
After building:
```bash
git add dist -f
git commit -m "Deploy website"
git subtree push --prefix dist origin main
```

## Customization

- **Colors**: Edit CSS variables in `src/index.css`
- **Content**: Update section data in `src/App.jsx`
- **Logo**: Replace `public/singularity-icon.svg`
- **Instagram**: Change the embed URL in the Events component
- **Next Event Date**: Update `nextEventDate` in `Events()` component

## Forum Feature

The forum uses browser localStorage to persist posts. For a real multi-user forum, you would need:
- Backend API (Node.js + Express, Django, etc.)
- Database (PostgreSQL, MongoDB)
- User authentication

Check the `Forum` component to extend with real API calls.

## License

Open source for educational purposes.
