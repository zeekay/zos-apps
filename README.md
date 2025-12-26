# zOS Apps

Official app repository for zOS - dynamically loaded web applications.

## Available Apps

| App | Icon | Category | Description |
|-----|------|----------|-------------|
| Calculator | 🧮 | utilities | Basic math operations |
| Notes | 📝 | productivity | Quick notes and markdown |
| Weather | 🌤️ | utilities | Weather forecast |
| Clock | 🕐 | utilities | World clock, timer, stopwatch |
| Reminders | ✅ | productivity | Task list and reminders |

## How It Works

Apps are loaded dynamically from this repository via CDN:
1. zOS fetches the app registry from GitHub Pages (`docs/apps.json`)
2. When an app is launched, it's loaded from jsDelivr CDN
3. Apps are cached for fast subsequent launches

## Creating an App

1. Create a new folder in `apps/`
2. Add a `package.json` with zOS metadata:

```json
{
  "name": "@zos-apps/my-app",
  "version": "1.0.0",
  "zos": {
    "id": "com.example.myapp",
    "name": "My App",
    "icon": "🚀",
    "category": "utilities",
    "description": "App description",
    "permissions": [],
    "window": {
      "defaultSize": { "width": 400, "height": 300 },
      "resizable": true
    }
  }
}
```

3. Export a default React component:

```tsx
import React from 'react';

interface AppProps {
  onClose: () => void;
}

const MyApp: React.FC<AppProps> = ({ onClose }) => {
  return (
    <div className="h-full p-4 bg-black text-white">
      <h1>My App</h1>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default MyApp;
```

4. Build: `pnpm build`
5. Update registry: `pnpm build:registry`

## Development

```bash
# Install dependencies
pnpm install

# Build all apps
pnpm build

# Build registry
pnpm build:registry

# Watch mode (for development)
pnpm dev
```

## Categories

- `utilities` - Calculator, Clock, etc.
- `productivity` - Notes, Reminders, etc.
- `entertainment` - Music, Videos, etc.
- `social` - Chat, Social media, etc.
- `developer` - Code editors, terminals, etc.
- `other` - Everything else

## License

MIT
