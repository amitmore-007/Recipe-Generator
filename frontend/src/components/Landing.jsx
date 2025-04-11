import React, { useState, useEffect } from 'react';
import { FiSearch, FiImage, FiMic, FiGlobe, FiChevronRight, FiArrowRight, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const LandingPage = () => {
  const [language, setLanguage] = useState('English');
  const languages = ['English', 'Español', 'Français', '中文', 'हिन्दी', '日本語'];
  const [currentLangIndex, setCurrentLangIndex] = useState(0);

  // Auto-rotate languages for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLangIndex((prev) => (prev + 1) % languages.length);
      setLanguage(languages[(currentLangIndex + 1) % languages.length]);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentLangIndex]);

  return (
    <div className="font-sans bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md backdrop-blur-lg bg-opacity-80">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <motion.a 
            href="#home" 
            className="text-3xl font-extrabold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-emerald-500">RECIPE</span>
            <span className="text-indigo-600">AI</span>
          </motion.a>
          
          <div className="hidden md:flex items-center space-x-1">
            <a href="#home" className="px-6 py-2 font-semibold text-gray-600 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-indigo-600 hover:text-white rounded-full transition duration-300">
              Home
            </a>
            <a href="#about" className="px-6 py-2 font-semibold text-gray-600 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-indigo-600 hover:text-white rounded-full transition duration-300">
              About
            </a>
            <a href="#features" className="px-6 py-2 font-semibold text-gray-600 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-indigo-600 hover:text-white rounded-full transition duration-300">
              Features
            </a>
          </div>
          
          <motion.a 
            href="/login" 
            className="flex items-center space-x-1 font-semibold text-white bg-gradient-to-r from-emerald-500 to-indigo-600 px-6 py-2 rounded-full transition duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUser className="mr-2" />
            <span>Sign In</span>
          </motion.a>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home" 
        className="min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center relative"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1524222717473-730000096953?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/70 to-emerald-700/70 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="w-full md:w-3/5">
            <motion.div 
              className="text-left ml-8 md:ml-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-emerald-400">RECIPE</span>
                <span className="text-white">AI</span>
              </h1>
              <div className="text-white text-xl md:text-2xl font-light mb-2">
                Turn your ingredients into
              </div>
              <div className="h-12 mb-6">
                <TypeAnimation
                  sequence={[
                    'delicious recipes',
                    2000,
                    'amazing dishes',
                    2000,
                    'culinary magic',
                    2000,
                  ]}
                  wrapper="div"
                  speed={50}
                  style={{ fontSize: '1.5rem', color: '#4ade80', fontWeight: 'bold' }}
                  repeat={Infinity}
                />
              </div>
              <p className="text-gray-100 text-lg mb-8 max-w-lg">
                Upload a photo, speak your ingredients, or just type what you have. Our AI will create the perfect recipe for you in seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  href="/login" 
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white rounded-full font-semibold hover:shadow-xl flex items-center transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  GET STARTED
                  <FiArrowRight className="ml-2" />
                </motion.a>
                <motion.a 
                  href="#demo" 
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-700 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  SEE DEMO
                </motion.a>
              </div>
              <div className="mt-8 text-gray-200 text-sm">
                Available in: 
                <motion.span 
                  className="ml-2 text-emerald-400 font-semibold"
                  key={language}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {language}
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="w-full md:w-7/12 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="About us" 
                className="w-full rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500"
              />
            </motion.div>
            <motion.div 
              className="w-full md:w-5/12 bg-white p-12 rounded-3xl shadow-lg -ml-0 md:-ml-20"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl text-gray-700 mb-8 font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600">Smart AI</span> that understands your kitchen
              </h3>
              <p className="text-gray-600 mb-6">
                RecipeAI uses advanced machine learning to analyze your ingredients and create personalized recipes tailored to your taste preferences, dietary restrictions, and cooking skill level.
              </p>
              <p className="text-gray-600">
                Whether you're a professional chef looking for inspiration or a beginner trying to make dinner with what's in your fridge, our AI assistant is here to help you create delicious meals every time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className="py-20 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1505935428862-770b6f24f629?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1734&q=80)" }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-white/95 backdrop-blur-md p-12 rounded-3xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl font-bold text-center mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600">Multiple Ways</span> to Find Your Recipe
            </h1>
            <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Our AI recipe generator gives you flexibility in how you input ingredients, making it easier than ever to discover new recipes no matter where you are.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-lg p-8 hover:shadow-xl transition duration-300"
                whileHover={{ y: -10 }}
              >
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FiSearch className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-700 mb-4">Text Search</h3>
                <p className="text-gray-600 text-center">
                  Simply type in your ingredients and our AI will analyze them to create the perfect recipe tailored just for you.
                </p>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-lg p-8 hover:shadow-xl transition duration-300"
                whileHover={{ y: -10 }}
              >
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FiImage className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-700 mb-4">Image Upload</h3>
                <p className="text-gray-600 text-center">
                  Take a photo of your ingredients or your fridge, and our AI will recognize them and suggest recipes you can make.
                </p>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-lg p-8 hover:shadow-xl transition duration-300"
                whileHover={{ y: -10 }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FiMic className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-700 mb-4">Voice Recognition</h3>
                <p className="text-gray-600 text-center">
                  Just speak the ingredients you have, and our AI will listen, understand, and create a recipe for you.
                </p>
              </motion.div>
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-gray-700 mb-8">Available in Multiple Languages</h3>
              
              <div className="flex flex-wrap justify-center gap-4">
                {languages.map((lang, index) => (
                  <motion.div 
                    key={lang}
                    className={`px-6 py-3 rounded-full font-medium ${language === lang ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white' : 'border border-gray-300 text-gray-600'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(lang)}
                  >
                    <div className="flex items-center">
                      <FiGlobe className="mr-2" />
                      {lang}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <motion.a 
                href="/login" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white rounded-full font-semibold hover:shadow-xl transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GET STARTED NOW
                <FiChevronRight className="ml-2" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            See How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600">RecipeAI</span> Works
          </motion.h2>
          
          <motion.div 
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 w-full">
              {/* This would be your demo video or interactive demo */}
              <div className="flex items-center justify-center h-96 bg-gradient-to-br from-indigo-100 to-emerald-100">
                <p className="text-gray-500 text-xl">Interactive Demo Animation Would Go Here</p>
              </div>
            </div>
          </motion.div>

          <div className="mt-16 text-center">
            <motion.a 
              href="/login" 
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START CREATING RECIPES
              <FiArrowRight className="ml-2" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <a href="#home" className="text-2xl font-bold">
                <span className="text-emerald-400">RECIPE</span>
                <span className="text-indigo-400">AI</span>
              </a>
              <p className="text-gray-400 mt-2">Turn ingredients into delicious recipes instantly</p>
            </div>
            
            <div className="flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-emerald-400 transition duration-300">Home</a>
              <a href="#about" className="text-gray-300 hover:text-emerald-400 transition duration-300">About</a>
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition duration-300">Features</a>
              <a href="#demo" className="text-gray-300 hover:text-emerald-400 transition duration-300">Demo</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} RecipeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;