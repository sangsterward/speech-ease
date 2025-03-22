# SpeechEase

A simple and accessible text-to-speech web application designed for children with special needs. The app works completely offline, utilizing browser-based capabilities without requiring external APIs.

## Features

- Text-to-Speech conversion using the Web Speech API
- Customizable button grid with dynamic sizing
- Sub-pages for word combinations
- Edit mode for customizing buttons and app settings
- Fully accessible with keyboard navigation and screen reader support
- Works offline - no internet connection required after initial load
- Local storage for saving user preferences and button configurations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/speechease.git
cd speechease
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your default browser at `http://localhost:3000`.

## Usage

### Basic Navigation

- Click on any button to hear its text spoken
- Use the speech bar at the top to type and speak custom text
- Access the menu in the top-right corner for additional options

### Edit Mode

1. Click the menu button in the top-right corner
2. Select "Enter Edit Mode"
3. Click on any button to edit its text
4. Click on a button's image to change it
5. Use the menu to adjust grid size and app title

### Creating Sub-Pages

1. Enter Edit Mode
2. Click on a button to edit
3. Set up a sub-page link for the button
4. Create buttons on the sub-page
5. Use the menu to navigate back to the main page

## Built With

- React.js
- TypeScript
- Tailwind CSS
- Web Speech API

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for improving accessibility in education
- Inspired by AAC (Augmentative and Alternative Communication) devices
- Designed with input from special education professionals 