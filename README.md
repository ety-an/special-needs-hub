special-needs-hub/
│
├── public/
│   └── index.html
│
├── src/
│   └── App.jsx
│
├── package.json
├── README.md
└── .gitignore
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Special Needs Hub</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
{
  "name": "special-needs-hub",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}# 🌈 Special Needs Hub

A simple, accessibility-first homepage designed for people with special needs.

- Built with React + TailwindCSS
- Voice navigation, adaptive UI, and visual schedule
- Free to host on Glitch, GitHub Pages, or Vercel

node_modules
dist
.env
