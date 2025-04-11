🍳 AI Recipe Generator

A smart and simple web app that helps you generate delicious recipes using AI! Upload ingredients, type a prompt, or even speak your request — and get AI-generated recipes with instructions, ingredients, and more.


✨ Features

- 🔍 **AI Recipe Generation** – Input ingredients or describe a meal, and let the AI generate a full recipe.
- 🖼️ **Image Upload** – Upload an image of ingredients to get a recipe suggestion.
- 🎤 **Voice Input** – Speak your request and generate a recipe using voice commands.
- 🌍 **Multi-language Support** – Generate recipes in multiple languages.
- 💾 **Download Recipes** – Save recipes as **PDF or Markdown**.
- 🔐 **User Authentication** – Register/Login with your credentials to save your favorite recipes.

---

🚀 Tech Stack

**Frontend**  
- React.js  
- Tailwind CSS  
- Web Speech API (for voice input)

Backend  
- Node.js + Express  
- MongoDB  
- OpenAI / Gemini API (for AI generation)

Other Tools
- Git LFS (for handling large assets)  
- Vite (build tool)  
- FastAPI (for image analysis microservice)

---

📦 Setup Instructions

 1. Clone the Repo
bash
git clone https://github.com/amitmore-007/Recipe-Generator.git
cd Recipe-Generator

2. Install Dependencies
bash

cd frontend
npm install

cd ../backend
npm install

3. Setup Environment Variables
Create a .env file in both frontend and backend directories with necessary API keys:

Example .env (Backend)
env

PORT=5000
MONGODB_URI=your_mongo_uri
OPENAI_API_KEY=your_key_here

Example .env (Frontend)
env

VITE_BACKEND_URL=http://localhost:5000


4. Run the App
bash

# Backend
cd backend
nodemon server.js

# Frontend
cd frontend
npm run dev


📸 Screenshots
Upload Ingredients	AI Recipe Output
🧠 How It Works
Uses Gemini/OpenAI API to understand prompts or ingredients.

Can process images or voice input.

Generates detailed recipe steps, ingredients, and suggestions.

Outputs can be downloaded or translated into different languages.

🛠️ To-Do / Roadmap
 Voice-based input

 Multi-language support

 Save/Download as PDF/Markdown

 User profile page with saved recipes

 Nutrition breakdown per recipe

 Share recipes with friends

🤝 Contributing
Contributions are welcome!
Please open an issue first to discuss what you’d like to add.


