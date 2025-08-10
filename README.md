# Zach Schneider - Portfolio Website

A modern React portfolio website built with Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ⚡ Built with Vite for lightning-fast development
- 🔧 TypeScript for type safety
- 🎨 Tailwind CSS for modern styling
- ✨ Framer Motion for smooth animations
- 📱 Fully responsive design
- 🌈 Beautiful gradient backgrounds and glass morphism effects
- 🚀 Astronaut-themed branding

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Add your images to the `public` folder:
   - Save your profile photo as `public/zach-photo.webp`
   - Save the astronaut favicon as `public/astronaut-favicon.png`

3. Start the development server:
   ```bash
   yarn dev
   ```

4. Build for production:
   ```bash
   yarn build
   ```

## Image Requirements

### Profile Photo (`public/zach-photo.webp`)
- Format: WebP (modern, efficient format)
- Recommended size: 512x512px or larger
- Square aspect ratio works best for the circular display

### Favicon (`public/astronaut-favicon.png`)
- Format: PNG
- Size: 32x32px or 64x64px
- Should work well at small sizes

## Technologies Used

- **React 18+** - Latest React features
- **Vite** - Next generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful & consistent icons

## Project Structure

```
src/
├── components/
│   └── Portfolio.tsx    # Main portfolio component
├── App.tsx             # Root component
├── main.tsx           # Application entry point
└── index.css          # Global styles with Tailwind

public/
├── zach-photo.webp    # Your profile photo (add this)
└── astronaut-favicon.png  # Astronaut favicon (add this)
```

## Customization

The portfolio is fully customizable:

- Update personal information in `src/components/Portfolio.tsx`
- Modify colors and styles in `tailwind.config.js`
- Add or remove social media links
- Customize animations and transitions

## Deployment

This project can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions for automated deployment

## License

© 2025 Zach Schneider, All rights reserved
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
