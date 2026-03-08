# Singularity AI Club Website

Modern, interactive website for the University of Waikato AI Club.

## Features

- **Responsive Design**: Works across desktop and mobile with a dark, grid-based visual style
- **Interactive Elements**:
  - Animated particle background
  - Smooth scroll navigation with a mobile menu
  - Glassmorphism cards with hover effects
  - Live Instagram embeds that size themselves to each post
- **Sections**:
  - Hero with call-to-action
  - About (Learn, Build, Connect)
  - Build tracks and project themes
  - Events and activity overview
  - Instagram updates section
  - Join membership call-to-action
  - Resources library
  - Direct contact links
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
This builds the site into `dist/` and then refreshes the GitHub Pages root files (`index.html` and `assets/`).

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
- **Instagram updates**: Update `public/instagram-posts.json` with the newest Instagram post URLs

## License

Open source for educational purposes.
