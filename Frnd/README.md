# 🚀 Next-Gen Data Intelligence Suite

A production-grade React application for AI-powered data analytics with real-time Groq integration.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)
![Groq](https://img.shields.io/badge/Groq-AI-purple)

## ✨ Features

- **🎨 Cyberpunk Dark Mode UI** - Premium glassmorphism design with fluid animations
- **🤖 AI-Powered Chat** - Real-time data insights using Groq API
- **📊 Dynamic ML Predictions** - Context-aware predictive analytics
- **📈 Interactive Visualizations** - Auto-generated charts with Recharts
- **🔄 Smart Data Processing** - Automated preprocessing pipeline
- **✏️ Column Renaming** - Click-to-edit table headers
- **🎯 Drag & Drop Upload** - Seamless CSV file handling

## 🛠️ Tech Stack

- **Core:** React 18.3 + Vite
- **Styling:** Tailwind CSS with custom cyberpunk theme
- **Animation:** Framer Motion
- **State:** Zustand
- **AI:** Groq SDK (Mixtral-8x7B)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API Key (get free at [console.groq.com](https://console.groq.com))

### Steps

1. **Extract the zip file**
```bash
unzip next-gen-data-intelligence-suite.zip
cd next-gen-data-intelligence-suite
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to `http://localhost:3000`

## 🎮 Usage Guide

### 1. Setup API Key
- On the Home page, enter your **Groq API Key**
- Get your free key at [console.groq.com](https://console.groq.com)
- Click "Save & Continue"

### 2. Upload Dataset
- Navigate to **Dataset** page
- Drag & drop a CSV file or click to browse
- **Click any column header** to rename it
- Changes update the global store instantly

### 3. Preprocess Data
- Go to **Preprocessing** page
- Run "Handle Missing Values" to clean nulls
- Watch the animated pipeline visualization

### 4. Process & Normalize
- Visit **Processing** page
- Click "Start Normalization" to scale numeric values
- Real-time progress bar shows status

### 5. ML Predictions (Dynamic Form)
- Navigate to **ML Prediction** page
- **Select Target Column** from dropdown (what to predict)
- **Feature inputs auto-generate** based on remaining columns
- Fill in feature values
- Click "Generate Prediction"
- AI analyzes your data and provides prediction with reasoning

### 6. Visualize Data
- Go to **Visualization** page
- Auto-detected numeric columns plotted as Bar & Line charts
- Interactive tooltips and legends

### 7. Chat with AI Assistant
- Click the **floating chat button** (bottom-right)
- Ask questions about your data
- AI has context of your dataset (first 5 rows + column names)
- Example: "What patterns do you see?" or "Suggest analysis"

## 📁 Project Structure

```
next-gen-data-intelligence-suite/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Collapsible navigation
│   │   └── ChatComponent.jsx    # AI chat interface
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing + API key setup
│   │   ├── DatasetPage.jsx       # Upload + column renaming
│   │   ├── PreprocessingPage.jsx # Data cleaning
│   │   ├── ProcessingPage.jsx    # Normalization
│   │   ├── MLPage.jsx            # Dynamic prediction form
│   │   └── VisualizationPage.jsx # Charts
│   ├── services/
│   │   └── groqService.js        # Groq API integration
│   ├── store/
│   │   └── useDataStore.js       # Zustand global state
│   ├── App.jsx                   # Main router
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind + custom styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔑 Key Features Explained

### Dynamic ML Form
The ML page reads the `headers` from the Zustand store:
1. User selects a **Target Column** (e.g., "Purchased")
2. System filters remaining columns as **Features** (e.g., "Age", "Salary")
3. Input fields **auto-generate** for each feature
4. On "Predict", Groq AI receives:
   - Feature values
   - Dataset context (column names + sample rows)
   - Target column name
5. AI returns prediction with confidence & reasoning

### Context-Aware Chatbot
When you ask questions, the system prompt includes:
```javascript
{
  headers: ["Age", "Salary", "Purchased"],
  preview: [
    { Age: 25, Salary: 50000, Purchased: "Yes" },
    // ... first 5 rows
  ]
}
```
This allows AI to give **data-specific insights** instead of generic answers.

### Column Renaming
Click any table header → Input field appears → Type new name → Press Enter
- Updates `headers` array in Zustand
- Updates all row objects with new key names
- Preserved across all pages (ML, Visualization, Chat)

## 🎨 Design System

### Colors
- **Primary:** Cyan (#06B6D4) → #0EA5E9
- **Secondary:** Purple (#8B5CF6) → Pink (#EC4899)
- **Background:** Gray-900 (#111827)
- **Surface:** Gray-800 (#1F2937)
- **Border:** Gray-700 (#374151)

### Animations
- **Floating mesh background** on Home page
- **Staggered list reveals** on Dataset table
- **Progress bars** with gradient fills
- **Glow effects** on active navigation items
- **Scale transforms** on button hover

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Push to GitHub
2. Connect repository to hosting platform
3. Build command: `npm run build`
4. Output directory: `dist`

## 🐛 Troubleshooting

### API Key Issues
- Error: "Groq client not initialized"
  → Go to Home page and set your API key

### CSV Upload Fails
- Ensure file has `.csv` extension
- Check that first row contains column headers
- Try re-uploading

### Charts Not Showing
- Verify dataset has numeric columns
- Check browser console for errors
- Ensure data is loaded in Dataset page

### Chat Not Responding
- Confirm API key is set
- Check internet connection
- Verify Groq API quota at [console.groq.com](https://console.groq.com)

## 📝 License

MIT License - feel free to use in your projects!

## 🙏 Credits

Built with ❤️ by the Data Intelligence Team

**Powered by:**
- React + Vite
- Groq AI (Mixtral-8x7B)
- Tailwind CSS
- Framer Motion
- Recharts

---

**Need help?** Check the inline code comments or open an issue!
