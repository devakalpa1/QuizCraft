# 🎯 QuizCraft - Smart Flashcard Learning Platform

A modern, feature-rich flashcard application built with React and Vite. Master any subject with smart study sessions, progress tracking, and persistent data storage.

![QuizCraft Banner](https://via.placeholder.com/800x200/667eea/ffffff?text=QuizCraft+-+Smart+Learning)

## ✨ Features

### 🎴 Smart Flashcards
- **Interactive Cards** - Click to flip between terms and definitions
- **Beautiful UI** - Modern glass morphism design with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 📊 Progress Tracking
- **Real-time Progress** - Track your learning progress as you study
- **Smart Statistics** - View study time, streaks, and performance metrics
- **Visual Feedback** - Color-coded progress bars and achievement indicators

### 💾 Data Persistence
- **Auto-Save** - Your progress is automatically saved as you study
- **Local Storage** - All data persists even when the server shuts down
- **Backup & Restore** - Export/import your data for safekeeping
- **Cross-Session** - Pick up exactly where you left off

### 🧠 Study Modes
- **Study Mode** - Review flashcards and mark your knowledge level
- **Test Mode** - Take quizzes with multiple-choice questions
- **Progress Reset** - Start fresh anytime with individual set resets

### 📂 Content Management
- **Create Sets** - Build custom flashcard sets with ease
- **Import Data** - Import from CSV files or paste directly
- **Export Data** - Download your study sets for backup
- **Organize** - Manage multiple study sets efficiently

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quizcraft.git
   cd quizcraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Styling**: Styled Components 6.1.19
- **Routing**: React Router DOM 7.7.0
- **Animations**: CSS animations & React Spring
- **Data Parsing**: PapaParse for CSV import
- **Storage**: localStorage for persistence

## 📱 Usage

### Creating Your First Study Set

1. Click **"Create Set"** from the homepage
2. Add a title and description
3. Create flashcard pairs (term/definition)
4. Save your set

### Studying

1. Select a study set from your dashboard
2. Use **Previous/Next** to navigate cards
3. Mark cards as **"Know It!"** or **"Need Practice"**
4. Track your progress in real-time

### Taking Tests

1. Click **"Take Test"** from any study set
2. Answer multiple-choice questions
3. Get instant feedback on your performance
4. Review detailed score analysis

### Data Management

1. **Export Data**: Download a backup JSON file
2. **Import Data**: Restore from a backup file
3. **Reset Progress**: Clear progress for individual sets

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface with subtle animations
- **Dark/Light Themes**: Automatic theme adaptation
- **Glass Morphism**: Beautiful translucent card effects
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: Engaging micro-interactions

## 📊 Data Structure

### Study Set Format
```json
{
  "id": 1640995200000,
  "title": "Spanish Vocabulary",
  "description": "Basic Spanish words and phrases",
  "cards": [
    {
      "term": "Hola",
      "definition": "Hello"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastStudied": "2024-01-02T15:30:00.000Z",
  "studyCount": 5,
  "averageScore": 85,
  "bestScore": 95
}
```

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Flashcard.jsx
│   ├── Header.jsx
│   └── ...
├── pages/              # Main application pages
│   ├── HomePage.jsx
│   ├── StudySetPage.jsx
│   ├── TestModePage.jsx
│   └── ...
├── context/            # React Context providers
│   └── StudySetContext.jsx
├── styles/             # Global styles
│   └── global.css
└── App.jsx             # Main application component
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using React and Vite
- Icons and design inspiration from modern UI frameworks
- Special thanks to the open-source community

## 📞 Support

If you have any questions or run into issues:
- Open an issue on GitHub
- Check the documentation
- Review existing issues for solutions

---

**Happy Learning with QuizCraft!** 🎓✨+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
