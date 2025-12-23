# CineZoom for YT™

<p align="center">
  <img src="logo.png" alt="CineZoom Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Transform your videos into a cinematic ultrawide experience with one click.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.3-blue" alt="Version">
  <img src="https://img.shields.io/badge/manifest-v3-green" alt="Manifest V3">
  <img src="https://img.shields.io/badge/license-MIT-orange" alt="License">
</p>

---

## ✨ Features

- 🎬 **One-Click Ultrawide Mode** - Instantly zoom videos to 21:9 cinematic aspect ratio
- 🎚️ **Custom Zoom Levels** - Adjust from 100% to 200% with a smooth slider
- ⚡ **Quick Presets** - Normal, 21:9, Cinema, and Ultra modes
- 🎹 **Keyboard Shortcut** - Toggle with `Option/Alt + Z`
- 🎮 **Player Button** - Native button integrated into YouTube's controls
- 💾 **Remembers Your Setting** - Your preferred zoom level is saved

## 📸 Screenshots

| Popup UI | Player Button |
|----------|---------------|
| Beautiful dark-themed popup with preset buttons and zoom slider | Native button in YouTube player controls |

## 🚀 Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/Eta06/cinezoom.git
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable **Developer mode** (toggle in top-right corner)

4. Click **Load unpacked** and select the cloned folder

5. The extension icon will appear in your toolbar!

## 🎯 Usage

### Quick Toggle
- **Click the extension icon** to open the popup
- **Press the toggle button** to switch between normal and ultrawide mode
- Use **preset buttons** for quick zoom levels

### Custom Zoom
- Use the **slider** to set any zoom level from 100% to 200%
- Your custom level is saved and used when toggling

### Keyboard Shortcut
| Shortcut | Action |
|----------|--------|
| `Option + Z` (Mac) | Toggle cinematic zoom |
| `Alt + Z` (Windows) | Toggle cinematic zoom |

### Player Button
- Look for the **cinematic screen icon** in YouTube's player controls
- Click to toggle zoom on/off
- A **red dot** indicates when zoom is active

## 📁 Project Structure

```
cinezoom-for-yt/
├── manifest.json      # Extension configuration
├── popup.html         # Popup UI
├── popup.js           # Popup logic
├── content.js         # YouTube page integration
├── background.js      # Keyboard shortcut handler
├── logo.png           # Extension icon
└── README.md          # This file
```

## 🛠️ Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `activeTab`, `scripting`, `storage`
- **Target**: YouTube (`*://*.youtube.com/*`)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📜 License

MIT License - feel free to use and modify!

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Eta06">Eta06</a>
</p>
