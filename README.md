# Vite React App

This project has been converted from Next.js to a pure React implementation using Vite.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # UI components (shadcn/ui)
│   └── ...             # Other components
├── dashboard/          # Dashboard page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── styles/             # Global styles
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── globals.css         # Global CSS
```

## Key Changes from Next.js

1. **Build System**: Migrated from Next.js to Vite
2. **Routing**: Replaced Next.js App Router with React Router
3. **Theme Provider**: Replaced `next-themes` with custom implementation
4. **File Structure**: Moved from `app/` directory to `src/` directory
5. **Entry Point**: Created `index.html` and `main.tsx` for Vite

## Features

- ⚡ Vite for fast development and building
- 🎨 Tailwind CSS for styling
- 🧩 shadcn/ui components
- 🌙 Dark/Light theme support
- 📱 Responsive design
- 🔧 TypeScript support

## Development

The development server will start on `http://localhost:3000` by default.

## Building

The build process will create a `dist/` directory with the production-ready files.
