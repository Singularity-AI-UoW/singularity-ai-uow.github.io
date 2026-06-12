# Singularity Website

Website for Singularity, the University of Waikato AI Club.

## Features

- **Responsive Design**: Works across desktop and mobile with a bright, editorial student-club visual style
- **Interactive Elements**:
  - Smooth scroll navigation with a mobile menu
  - Animated event cards and resource cards
  - Live Instagram profile embed
  - Countdown to the next scheduled event
- **Sections**:
  - Hero with call-to-action
  - 2026 events calendar with difficulty markers and workshop summaries
  - Instagram profile section
  - Resources library
  - Footer with sponsor and contact links
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

### Build for Production
```bash
npm run build
```
This builds the site into `dist/`, then refreshes the GitHub Pages root files (`index.html`, `assets/`, and public static assets).

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

## License

Open source for educational purposes.
