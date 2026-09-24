# Pi Cube Game Console
A custom game console menu built with Electron, React, and Vite — designed to run on a Raspberry Pi 4 as a dedicated embedded OS built with Yocto.

> ⚠️ This project is currently in active development. Many features are placeholders and will be implemented incrementally.

---

## Table of Contents
1. [Overview](#overview)
2. [Current State](#current-state)
3. [Planned Features](#planned-features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Building for Raspberry Pi](#building-for-raspberry-pi)
8. [Yocto Integration](#yocto-integration)
9. [Roadmap](#roadmap)

---

## Overview

Pi Cube Game Console is a fullscreen Electron application that serves as the main UI for a custom Raspberry Pi 4 based game console. It boots directly into the menu via a Yocto-built embedded Linux OS, replacing the standard desktop environment entirely.

| Property | Value |
|---|---|
| Target Hardware | Raspberry Pi 4 (armv7l) |
| OS | Custom Yocto Linux (scarthgap) |
| App Framework | Electron 32 + React 18 + Vite 5 |
| Display | Fullscreen X.Org via systemd service |

---

## Current State

The application currently provides basic navigation between two pages:

### Games Page
- Placeholder UI for browsing and selecting games
- Will display games stored on an external device
- Currently shows placeholder game entries with no launch functionality

### Options Page
- Placeholder UI for system settings
- Displays brightness and volume controls
- Controls are not yet functional — UI only

### Navigation
- Users can switch between the Games page and Options page
- Routing is handled by `react-router-dom`

---

## Planned Features

The following features will be implemented in this order:

### 1. 🔆 Brightness Adjustment
Connect the brightness slider on the Options page to the actual system display brightness. Will write to the Pi's backlight interface via Electron's Node.js backend.

### 2. 💾 External Device Manager
A new page for managing games and files stored on a USB drive or external storage device. Will allow users to browse, add, and remove games from the console.

### 3. 🎮 App/Game Launcher Window
A separate window for launching and running content. Pygame games are the initial supported format, launched via `python <game>.py`; the launcher's scope is expanding beyond games to general Python applications sharing the same launch model. Content opens in its own window while the menu remains in the background, allowing the user to return to the menu after a session ends.

### 4. 🔊 Volume Integration
Connect the volume slider on the Options page to the system audio level via ALSA. Will use Electron's Node.js backend to call `amixer` commands on the Pi.

### 5. 🕹️ Gamepad Support
Full gamepad/controller input support for navigating the menu without a keyboard or mouse. Will use the browser's Gamepad API to map controller inputs to menu navigation actions.

---

## Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | React DOM rendering |
| `react-router-dom` | ^7.13.1 | Page routing / navigation |

### Build Tools
| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.4.0 | Frontend bundler / dev server |
| `@vitejs/plugin-react` | ^4.3.0 | React support for Vite |
| `concurrently` | ^9.2.1 | Run Vite and Electron simultaneously in dev |

### Desktop
| Package | Version | Purpose |
|---|---|---|
| `electron` | ^32.0.0 | Desktop app wrapper |
| `electron-builder` | ^25.0.0 | Packages app as AppImage for ARM |

---

## Project Structure

```
pi-cube-game-console/
├── electron/
│   └── main.js              # Electron main process — window creation, IPC
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CancelButton.jsx
│   │   ├── CustomSlider.jsx
│   │   ├── DownButton.jsx
│   │   ├── GameSnippet.jsx
│   │   ├── Options.jsx
│   │   └── UpButton.jsx
│   ├── pages/               # Full page views
│   │   ├── Games.jsx        # Games browser page
│   │   └── MainMenu.jsx     # Main menu / landing page
│   ├── styles/              # CSS module styles
│   ├── App.jsx              # Root component + router setup
│   └── main.jsx             # React entry point
├── index.html               # Electron renderer entry point
├── vite.config.js           # Vite configuration
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install dependencies
```bash
npm install
```

### Run in development mode
```bash
npm start
```
This starts both the Vite dev server and Electron simultaneously.

### Build for production (local x64)
```bash
npm run package:local
```

### Build for Raspberry Pi (armv7l)
```bash
npm run package:pi
```
Output: `dist/Game-Console-Menu-1.0.0-armv7l.AppImage`

---

## Building for Raspberry Pi

The app is packaged as an `armv7l` AppImage for the Raspberry Pi 4's 32-bit userspace.

> ⚠️ **Architecture Note**: The target is `armv7l` (32-bit), NOT `arm64`. Raspberry Pi OS uses a 32-bit userspace even on the Pi 4's 64-bit hardware. Using `arm64` will result in a binary that silently fails to run.

```bash
# Build the armv7l AppImage
npm run package:pi

# Test on Pi via SSH
scp dist/Game-Console-Menu-1.0.0-armv7l.AppImage user@<pi-ip>:/home/user/
ssh user@<pi-ip>
DISPLAY=:0 ./Game-Console-Menu-1.0.0-armv7l.AppImage --no-sandbox
```

### Required Electron flags on Pi
The following flags are required when running on the Yocto image due to missing GPU/EGL support:
```
--no-sandbox
--disable-gpu
--disable-software-rasterizer
--disable-gpu-compositing
--use-gl=swiftshader
```

---

## Yocto Integration

This app is deployed as part of a custom Yocto Linux image for the Raspberry Pi 4. The Yocto layer that packages and auto-starts this app is maintained separately:

👉 **[meta-game-console](https://github.com/javersa86/meta-game-console)**

The Yocto build extracts the AppImage contents and installs them to `/opt/game-console-menu/` on the target image. A systemd service starts X.Org and launches the app automatically on boot.

---

## Roadmap

```
✅ Phase 0 — Project setup and Yocto deployment
✅ Phase 1 — Basic page navigation (Games + Options)
⬜ Phase 2 — Brightness adjustment (Options → system)
⬜ Phase 3 — External device manager page
⬜ Phase 4 — App/game launcher window (pygame games as initial format, expanding to general Python apps)
⬜ Phase 5 — Volume integration (Options → ALSA)
⬜ Phase 6 — Gamepad / controller support
```

---

## Notes
This project was developed for personal/educational purposes. The Yocto build configuration and initial project structure were developed with the assistance of Claude (Anthropic) and validated through iterative testing on physical hardware.

---

## Repository History
The repository moved on 2026-09-23 from the `Brickhouse4U` GitHub account to [`javersa86`](https://github.com/javersa86), consolidating all portfolio projects under one account. History, issues, and pull requests came with it, and old `github.com/Brickhouse4U/...` links redirect here automatically. To update an existing clone:
```bash
git remote set-url origin https://github.com/javersa86/pi-cube-game-console.git
```
