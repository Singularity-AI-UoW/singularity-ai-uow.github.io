# Singularity Website

Website for Singularity, the University of Waikato AI Club.

## Features

- **Responsive Design**: Works across desktop and mobile with a dark, grid-based visual style
- **Interactive Elements**:
  - Animated particle background
  - Smooth scroll navigation with a mobile menu
  - Glassmorphism cards with hover effects
  - Live Instagram embed iframes sized to each post
- **Sections**:
  - Hero with call-to-action
  - About section
  - 2026 events calendar with playbook summaries
  - Instagram updates section
  - Executive team section
  - Resources library
  - Footer with contact links
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
Open `http://localhost:5173/site.html` in your browser.
Starting the dev server also refreshes `public/instagram-posts.json` from the latest public Instagram posts.

### Build for Production
```bash
npm run build
```
This first refreshes `public/instagram-posts.json` from Instagram, then builds the site into `dist/`, and finally refreshes the GitHub Pages root files (`index.html` and `assets/`).

### Preview Production Build
```bash
npm run preview
```

## Deploy to GitHub Pages

1. Build the site with `npm run build`
2. Commit the updated root `index.html` and `assets/` files
3. Push the main branch to GitHub
4. In repository settings, configure GitHub Pages to deploy from the main branch root

## Customization

- **Colors**: Edit CSS variables in `src/index.css`
- **Content**: Update section data in `src/App.jsx`
- **Logo**: Replace `public/singularity-icon.svg`
- **Instagram updates**: Run `npm run sync:instagram` to refresh `public/instagram-posts.json` from the latest public posts

## License

Open source for educational purposes.
