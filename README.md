# Japanese Days of the Week Quiz

An Electron desktop application to help you learn and practice the days of the week in Japanese.

## Features

- **Two Quiz Modes:**
  - Japanese → English: See Japanese characters and select the English equivalent
  - English → Japanese: See English day names and select the Japanese equivalent

- **Interactive Learning:**
  - Randomized questions for better learning
  - Immediate feedback on answers
  - Score tracking and percentage calculation
  - Review section with all days, pronunciations, and meanings

- **User-Friendly Interface:**
  - Modern, clean design
  - Keyboard shortcuts support (1-4 for answers, Enter/Space for next)
  - Responsive layout

## Japanese Days of the Week

| Japanese | Romaji | English |
|----------|--------|---------|
| 月曜日 | getsuyōbi | Monday |
| 火曜日 | kayōbi | Tuesday |
| 水曜日 | suiyōbi | Wednesday |
| 木曜日 | mokuyōbi | Thursday |
| 金曜日 | kinyōbi | Friday |
| 土曜日 | doyōbi | Saturday |
| 日曜日 | nichiyōbi | Sunday |

## Installation

1. **Clone or download this repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

- **Development mode (with DevTools):**
  ```bash
  npm run dev
  ```

- **Normal mode:**
  ```bash
  npm start
  ```

## Building the Application

To create distributable packages:

### Build for Current Platform
```bash
npm run build
```

### Build for Specific Platforms
```bash
# Windows (NSIS installer + portable) - Works on any OS
npm run build:win

# macOS (DMG + ZIP for x64 and ARM64/M1) - Requires macOS
npm run build:mac

# Linux (TAR.GZ archive + directory) - Works on any OS
npm run build:linux
```

### Test Available Builds
Since you're on Windows, you can build:
```bash
# These will work on your Windows machine:
npm run build:win     # Windows builds
npm run build:linux   # Linux builds

# This will fail (requires macOS):
npm run build:mac
```

### Build for All Platforms
```bash
npm run build:all
```

**Note:** Building for macOS requires a Mac computer or CI/CD service. Building for Windows and Linux can be done from any platform.

**Platform Build Requirements:**
- ✅ **Windows builds**: Can be built from Windows, macOS, or Linux
- ✅ **Linux builds**: Can be built from Windows, macOS, or Linux
- ❌ **macOS builds**: Require macOS due to Apple code signing requirements

## Summary

**Local Development:**
- ✅ **Windows builds**: Full installer and portable versions
- ✅ **Linux builds**: TAR.GZ archive that works on any Linux distribution
- ❌ **macOS builds**: Requires macOS (Apple security restrictions)

**GitHub Actions (Automatic):**
- ✅ **All platforms**: Windows, macOS, and Linux builds via GitHub runners
- ✅ **Automatic releases**: Creates GitHub releases with all platform builds
- ✅ **Cross-platform**: Builds everything from the cloud, no local restrictions

### GitHub Actions Workflows

This repository includes automated build workflows:

1. **Release Workflow** (`.github/workflows/release.yml`):
   - Triggers on version tags (e.g., `v1.0.0`, `v1.2.3`)
   - Builds for Windows, macOS, and Linux automatically
   - Creates GitHub releases with all platform binaries
   - Can be triggered manually from GitHub Actions tab

2. **Build Test Workflow** (`.github/workflows/build-test.yml`):
   - Triggers on pull requests and manual runs
   - Tests builds without creating releases
   - Useful for testing changes before release

### Creating a Release

1. **Tag a new version:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Automatic build**: GitHub Actions will:
   - Build for Windows (installer + portable)
   - Build for macOS (DMG + ZIP, Intel + Apple Silicon)
   - Build for Linux (AppImage + DEB + TAR.GZ)
   - Create a GitHub release with all files

3. **Manual trigger**: Go to GitHub Actions tab and run "Build and Release" manually

### Output Formats

**Local builds** (what you can build on Windows):
- **Windows**: NSIS installer (.exe) and Portable executable
- **Linux**: TAR.GZ archive

**GitHub Actions builds** (automatic with releases):
- **Windows**: NSIS installer (.exe) and Portable executable
- **macOS**: DMG disk image and ZIP archive (Intel + Apple Silicon)
- **Linux**: AppImage (universal), DEB (Debian/Ubuntu), and TAR.GZ archive

All builds will be created in the `dist/` folder locally, or attached to GitHub releases automatically.

## How to Use

1. **Start the application**
2. **Choose your quiz mode:**
   - Click "Japanese → English" to see Japanese characters and guess English
   - Click "English → Japanese" to see English words and guess Japanese

3. **Answer questions:**
   - Click on one of the four multiple choice options
   - Use keyboard shortcuts (1-4) for quick selection
   - Get immediate feedback on your answer

4. **Navigate:**
   - The app automatically advances after answering (0.6 seconds)
   - Click "Skip Question" or press Enter to skip without answering
   - View your final score and percentage at the end
   - Use "Review Answers" to study all days with pronunciations

5. **Start over:**
   - Click "New Quiz" anytime to restart with randomized questions

## Keyboard Shortcuts

- **1-4**: Select answer options
- **Enter**: Skip current question
- **Space**: Start new quiz
- **Ctrl+N**: New Quiz (from menu)
- **F12**: Toggle Developer Tools
- **F11**: Toggle Fullscreen

## Development

The application is built with:
- **Electron**: Desktop app framework
- **HTML/CSS/JavaScript**: Frontend technologies
- **Modern ES6+**: JavaScript features

### File Structure

```
japanese-week-quiz/
├── .github/
│   └── workflows/
│       ├── release.yml       # Automated release builds
│       └── build-test.yml    # Test builds for PRs
├── main.js                   # Electron main process
├── index.html                # App interface
├── styles.css                # Styling and layout
├── renderer.js               # Quiz logic and interactions
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── RELEASE.md                # Release guide
```

## Contributing

Feel free to fork this project and submit pull requests for improvements such as:
- Additional quiz modes (romaji recognition, audio pronunciation)
- More comprehensive Japanese learning features
- UI/UX enhancements
- Performance optimizations

## License

MIT License - feel free to use this for educational purposes or as a starting point for your own language learning applications.

## Educational Notes

### About Japanese Days of the Week

Japanese days of the week are based on traditional Chinese elements and celestial bodies:

- **月曜日 (getsuyōbi)**: Moon Day (Monday)
- **火曜日 (kayōbi)**: Fire Day (Tuesday)
- **水曜日 (suiyōbi)**: Water Day (Wednesday)
- **木曜日 (mokuyōbi)**: Wood Day (Thursday)
- **金曜日 (kinyōbi)**: Metal/Gold Day (Friday)
- **土曜日 (doyōbi)**: Earth Day (Saturday)
- **日曜日 (nichiyōbi)**: Sun Day (Sunday)

Each day is formed by combining the element/celestial body character with 曜日 (yōbi), which means "day of the week."
