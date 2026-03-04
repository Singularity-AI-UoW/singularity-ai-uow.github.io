#!/bin/bash
set -e

echo "🚀 Deploying Singularity AI Club website to GitHub Pages..."

# Build the project
npm run build

# Create gh-pages branch if it doesn't exist
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages

# Remove everything except dist and .nojekyll
find . -maxdepth 1 ! -name 'dist' ! -name '.nojekyll' ! -name '.git' ! -name '.' -exec rm -rf {} +

# Copy built files
cp -r dist/* .

# Add .nojekyll for proper SPA routing
touch .nojekyll

# Commit and push
git add -A
git commit -m "Deploy website $(date +'%Y-%m-%d %H:%M:%S')" || echo "No changes to deploy"
git push -f origin gh-pages

echo "✅ Website deployed to https://singularityai.github.io"
echo "   (Note: may take a few minutes to propagate)"
