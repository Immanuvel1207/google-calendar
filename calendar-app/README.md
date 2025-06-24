# 📅 TickTide - Advanced React Calendar Application

A comprehensive, feature-rich calendar application built with React that combines event management, task prioritization, and habit tracking in one seamless interface. Perfect for professionals, students, and anyone looking to organize their life effectively.

## 🌟 Features

### 📅 **Smart Calendar Management**
- **Multiple View Modes**: Month, Week, and Day views with smooth transitions
- **Event Creation & Management**: Create, edit, delete, and view detailed events
- **Smart Conflict Detection**: Automatic detection and resolution of scheduling conflicts
- **Event Categories**: Meetings, Reviews, Presentations, Training, Personal, Birthdays, and more
- **Color-Coded Events**: Visual organization with customizable color schemes
- **Holiday Integration**: Automatic fetching of national and regional holidays (Tamil Nadu)

### 🎯 **Task & Priority Management**
- **Weekly Priorities**: Focus on what matters most each week
- **Priority Levels**: High, Medium, and Low priority classification
- **Progress Tracking**: Visual completion status and statistics
- **Smart Persistence**: Data saved locally with JSON fallback

### 📊 **Habit Tracking System**
- **Daily Habit Monitoring**: Track habits across different days of the week
- **Flexible Scheduling**: Set habits for specific days only
- **Weekly Progress**: Visual progress indicators and completion rates
- **Reset Functionality**: Weekly habit reset for fresh starts

### 🔔 **Smart Notifications**
- **Desktop Notifications**: Browser-based event reminders
- **Customizable Reminders**: 5 minutes to 1 day advance notifications
- **In-App Notifications**: Non-intrusive notification system

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional Theme**: Clean white, green, and matte blue color scheme
- **Smooth Animations**: Page transitions and view changes
- **Accessibility**: Full keyboard navigation and screen reader support

### 💾 **Data Management**
- **Local Storage**: Automatic data persistence
- **JSON Integration**: Pre-loaded realistic data
- **Export Ready**: Structured data format for easy export
- **Conflict Resolution**: Smart handling of data conflicts

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/calendar-pro.git
   cd calendar-pro
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm start
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

\`\`\`
src/
├── components/           # React components
│   ├── Calendar.js      # Main calendar component
│   ├── Priorities.js    # Task and habit management
│   ├── EventModal.js    # Event creation/editing
│   ├── EventList.js     # Event sidebar
│   ├── MiniCalendar.js  # Navigation calendar
│   └── ...              # Other modals and components
├── data/                # JSON data files
│   ├── events.json      # Sample events
│   ├── priorities.json  # Default priorities
│   ├── habits.json      # Default habits
│   └── holidays.json    # Holiday data
├── styles/              # CSS styling
│   └── Calendar.css     # Main stylesheet
└── App.js              # Root component
\`\`\`

## 🎯 Key Components

### **Calendar Component**
- Main calendar interface with multiple view modes
- Event management and conflict resolution
- Holiday integration and display
- Search and filtering capabilities

### **Priorities Component**
- Weekly priority management
- Task completion tracking
- Habit monitoring system
- Progress analytics

### **Event Management System**
- Modal-based event creation
- Conflict detection and resolution
- Category-based organization
- Reminder system integration

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile (< 480px)**: Stacked layout, touch-optimized controls
- **Tablet (481px - 768px)**: Adaptive sidebar, optimized spacing
- **Desktop (> 768px)**: Full sidebar layout, multi-panel view

## 🔧 Customization

### **Adding New Event Categories**
\`\`\`javascript
const eventCategories = {
  newCategory: { label: "New Category", color: "#your-color" }
}
\`\`\`

### **Modifying Default Data**
Edit the JSON files in the `src/data/` directory:
- `priorities.json` - Default weekly priorities
- `habits.json` - Default habit templates
- `events.json` - Sample events

### **Styling Customization**
The CSS uses custom properties for easy theming:
\`\`\`css
:root {
  --primary-500: #0ea5e9;    /* Main brand color */
  --success-500: #22c55e;    /* Success/completion color */
  --gray-50: #f8fafc;        /* Background color */
}
\`\`\`

## 🌐 API Integration

### **Holiday API**
- Fetches national holidays from `date.nager.at`
- Includes Tamil Nadu regional holidays
- Automatic yearly updates

### **Motivational Quotes**
- Daily quotes from `quotable.io`
- Cached for 24 hours
- Fallback quotes for offline use

## 📊 Data Flow

1. **Initialization**: Load data from JSON files and localStorage
2. **User Interaction**: Create, edit, or delete items
3. **State Management**: Update React state
4. **Persistence**: Save to localStorage
5. **Sync**: Merge with JSON defaults on reload

## 🔒 Privacy & Security

- **Local Storage Only**: No data sent to external servers
- **Client-Side Processing**: All operations happen in the browser
- **No User Tracking**: Privacy-focused design

## 🚀 Performance Features

- **Lazy Loading**: Components loaded on demand
- **Optimized Rendering**: Efficient React patterns
- **Caching**: API responses cached locally
- **Responsive Images**: Optimized for different screen sizes

## 🧪 Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

## 📦 Building for Production

Create a production build:
\`\`\`bash
npm run build
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Day.js** - For date manipulation
- **Quotable API** - For motivational quotes
- **Nager.Date API** - For holiday data

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

---

**Built with ❤️ using React, JavaScript, and modern web technologies.**
