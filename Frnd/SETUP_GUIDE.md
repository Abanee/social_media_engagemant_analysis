# 🚀 Quick Setup Guide

## Prerequisites Check
✅ Node.js 18+ installed (`node --version`)  
✅ npm or yarn installed (`npm --version`)  
✅ Groq API Key (free at https://console.groq.com)

## Installation (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```
⏱️ Takes 2-3 minutes

### Step 2: Start Development Server
```bash
npm run dev
```
✅ Server starts at http://localhost:3000

### Step 3: Configure API Key
1. Open http://localhost:3000 in browser
2. Enter your Groq API Key on the Home page
3. Click "Save & Continue"

## 🎯 Quick Test (5 minutes)

### Test the Complete Workflow

1. **Upload Data**
   - Go to "Dataset" page
   - Drag and drop `sample-data.csv` (included in project)
   - Verify 15 rows loaded

2. **Rename Columns**
   - Click "Age" header
   - Rename to "Employee_Age"
   - Press Enter → Updates everywhere!

3. **Run Preprocessing**
   - Go to "Preprocessing" page
   - Click "Run Step" on "Handle Missing Values"
   - Watch animated pipeline

4. **Generate Prediction**
   - Go to "ML Prediction" page
   - Select Target: "Purchased"
   - Feature inputs auto-appear for: Name, Age, Salary, Department
   - Fill example values:
     - Name: "Test User"
     - Age: "35"
     - Salary: "65000"
     - Department: "Sales"
   - Click "Generate Prediction"
   - AI returns prediction with reasoning!

5. **Chat with AI**
   - Click floating chat button (bottom-right)
   - Ask: "What patterns do you see in the salary data?"
   - AI has context of your dataset and responds!

6. **View Charts**
   - Go to "Visualization" page
   - See auto-generated Bar & Line charts
   - Numeric columns (Age, Salary) plotted automatically

## 🎨 Feature Highlights

### Dynamic ML Form ⭐
- Select target column → Feature inputs generate automatically
- Example: If CSV has [Age, Salary, Purchased]
  - Select "Purchased" as target
  - Inputs appear for "Age" and "Salary"
  - AI predicts based on your input values

### Context-Aware Chat 🤖
- AI knows your column names
- AI sees first 5 rows of data
- Asks data-specific questions
- Get actionable insights

### Editable Headers ✏️
- Click any column header to edit
- Renames in Zustand store
- Updates propagate to ML page, charts, chat context

## 🆘 Common Issues

**"Module not found" error**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use**
```bash
# Edit vite.config.js, change port to 3001
server: {
  port: 3001
}
```

**Chat not responding**
- Verify API key is set on Home page
- Check Groq console for quota: https://console.groq.com

**Charts blank**
- Ensure data has numeric columns
- Try uploading sample-data.csv

## 📦 Build for Production

```bash
npm run build
```
Output: `dist/` folder

## 🎓 Learning Resources

- **Zustand Store**: `src/store/useDataStore.js`
- **Groq Integration**: `src/services/groqService.js`
- **Dynamic Form Logic**: `src/pages/MLPage.jsx` (lines 20-35)
- **Chat Context**: `src/components/ChatComponent.jsx` (lines 35-45)

## 🚀 Next Steps

1. ✅ Test with sample-data.csv
2. ✅ Upload your own CSV
3. ✅ Customize color theme in tailwind.config.js
4. ✅ Add more preprocessing operations
5. ✅ Deploy to Vercel/Netlify

---

**Questions?** Check README.md for detailed documentation!
