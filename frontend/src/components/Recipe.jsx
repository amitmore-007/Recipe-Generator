import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  ChefHat,
  Search,
  ArrowRight,
  Clock,
  Users,
  BookOpen,
  X,
  Image as ImageIcon,
  Mic,
  Globe,
  Download,
  Sparkles,
  Heart,
  Flame,
  Utensils,
  Check,
  Info,
  GaugeCircle,
  Leaf,
  HelpCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Translated texts for UI elements
const getTranslatedText = (key, language) => {
  const translations = {
    ingredients: {
      en: 'Ingredients',
      es: 'Ingredientes',
      fr: 'Ingrédients',
      de: 'Zutaten',
      it: 'Ingredienti',
      pt: 'Ingredientes',
      hi: 'सामग्री',
      ja: '材料',
      zh: '成分',
      ar: 'مكونات'
    },
    uploadImage: {
      en: 'Upload Image',
      es: 'Subir imagen',
      fr: 'Télécharger image',
      de: 'Bild hochladen',
      it: 'Carica immagine',
      pt: 'Enviar imagem',
      hi: 'छवि अपलोड करें',
      ja: '画像をアップロード',
      zh: '上传图片',
      ar: 'تحميل صورة'
    },
    recipe: {
      en: 'Recipe',
      es: 'Receta',
      fr: 'Recette',
      de: 'Rezept',
      it: 'Ricetta',
      pt: 'Receita',
      hi: 'विधि',
      ja: 'レシピ',
      zh: '食谱',
      ar: 'وصفة'
    },
    whatInKitchen: {
      en: 'What\'s in your kitchen?',
      es: '¿Qué tienes en tu cocina?',
      fr: 'Qu\'avez-vous dans votre cuisine ?',
      de: 'Was hast du in deiner Küche?',
      it: 'Cosa hai in cucina?',
      pt: 'O que você tem na sua cozinha?',
      hi: 'आपकी रसोई में क्या है?',
      ja: 'キッチンにあるものは？',
      zh: '你的厨房里有什么？',
      ar: 'ماذا لديك في مطبخك؟'
    },
    // More translations...
  };
  
  return translations[key]?.[language] || translations[key]?.en;
};

// Custom hook for managing speech recognition
function useSpeechRecognition(language, onTranscript) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Changed to true for better experience
        recognition.interimResults = true;
        
        // Language mapping
        const languageCodeMap = {
          en: 'en-US',
          es: 'es-ES',
          fr: 'fr-FR',
          de: 'de-DE',
          it: 'it-IT',
          pt: 'pt-PT',
          hi: 'hi-IN',
          ja: 'ja-JP',
          zh: 'zh-CN',
          ar: 'ar-SA'
        };
        
        recognition.lang = languageCodeMap[language] || 'en-US';

        recognition.onstart = () => {
          setIsProcessing(true);
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join(' ');
          
          if (event.results[0].isFinal) {
            onTranscript(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setIsProcessing(false);
        };

        recognition.onend = () => {
          setIsProcessing(false);
          // Don't reset isListening here - let the button control it
        };

        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log("Recognition already stopped");
        }
      }
    };
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        alert("Please allow microphone access to use voice input");
      }
    }
  };

  return { isListening, isProcessing, toggleListening };
}

// Nutrition component
function NutritionFacts({ language }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
      <h3 className="text-gray-800 font-bold text-lg mb-2 flex items-center">
        <Info className="h-5 w-5 mr-2 text-emerald-500" />
        {language === 'es' ? 'Información Nutricional' : 
         language === 'fr' ? 'Information Nutritionnelle' : 
         language === 'de' ? 'Nährwertinformationen' : 
         'Nutrition Facts'}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between py-1 border-b border-gray-200">
          <span className="text-gray-600">Calories</span>
          <span className="font-medium">320</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-200">
          <span className="text-gray-600">Protein</span>
          <span className="font-medium">18g</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-200">
          <span className="text-gray-600">Carbs</span>
          <span className="font-medium">42g</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-200">
          <span className="text-gray-600">Fat</span>
          <span className="font-medium">12g</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-200">
          <span className="text-gray-600">Fiber</span>
          <span className="font-medium">6g</span>
        </div>
      </div>
    </div>
  );
}

// Recipe Health Meter
function HealthMeter({ score = 85, language }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 shadow-sm">
      <h3 className="text-gray-800 font-bold text-lg mb-2 flex items-center">
        <Heart className="h-5 w-5 mr-2 text-rose-500" />
        {language === 'es' ? 'Índice de Salud' : 
         language === 'fr' ? 'Indice de Santé' : 
         language === 'de' ? 'Gesundheitsindex' : 
         'Health Index'}
      </h3>
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full ${
            score > 80 ? 'bg-emerald-500' : 
            score > 60 ? 'bg-green-500' : 
            score > 40 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
      <div className="mt-2 text-center">
        <span className={`font-medium ${
          score > 80 ? 'text-emerald-600' : 
          score > 60 ? 'text-green-600' : 
          score > 40 ? 'text-yellow-600' : 
          'text-red-600'
        }`}>
          {score}/100 - {
            score > 80 ? (language === 'es' ? 'Excelente' : language === 'fr' ? 'Excellent' : 'Excellent') : 
            score > 60 ? (language === 'es' ? 'Muy Bueno' : language === 'fr' ? 'Très Bon' : 'Very Good') : 
            score > 40 ? (language === 'es' ? 'Bueno' : language === 'fr' ? 'Bon' : 'Good') : 
            (language === 'es' ? 'Regular' : language === 'fr' ? 'Moyen' : 'Fair')
          }
        </span>
      </div>
    </div>
  );
}

// Recipe tags component
function RecipeTags({ tags = ["Healthy", "Protein-rich", "Quick", "Budget-friendly"], language }) {
  return (
    <div className="flex flex-wrap gap-2 my-2">
      {tags.map((tag, index) => (
        <motion.span 
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm"
        >
          <Leaf className="h-3 w-3" />
          {tag}
        </motion.span>
      ))}
    </div>
  );
}

// Main component
function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [recipeData, setRecipeData] = useState(null);
  
  // Animation controls
  const controls = useAnimation();
  const buttonControls = useAnimation();
  
  // Breathing animation for button
  useEffect(() => {
    buttonControls.start({
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    });
  }, [buttonControls]);

  // Handle voice input
  const handleTranscript = (transcript) => {
    setIngredients(prev => {
      if (prev.trim()) {
        return `${prev}, ${transcript}`;
      }
      return transcript;
    });
  };
  
  const { isListening, isProcessing, toggleListening } = useSpeechRecognition(language, handleTranscript);

  // Image upload preview
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // Parsed ingredients
  const ingredientList = ingredients
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  // Generate recipe
  const generate = async () => {
    if (!ingredients.trim() && !imageFile) return;
    setLoading(true);
    controls.start({ opacity: 0.5 });

    try {
      let res;
      if (activeTab === "ingredients") {
        res = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients, language }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("language", language);

        res = await fetch("http://localhost:8000/generate-from-image", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      setRecipe(data.recipe);
      
      // Mock recipe data with additional nutritional information
      setRecipeData({
        title: data.recipe.split('\n')[0]?.replace('# ', '') || "Delicious Recipe",
        preparationTime: "30 min",
        difficulty: "Easy",
        servings: 4,
        calories: 320,
        protein: "18g",
        carbs: "42g",
        fat: "12g",
        healthScore: 85,
        tags: ["Balanced", "Protein-rich", "Fiber-rich", "Quick"]
      });
      
      setActiveTab("recipe");
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setLoading(false);
      controls.start({ opacity: 1 });
    }
  };

  // Download recipe as PDF
  const downloadPDF = async () => {
    try {
      const res = await fetch("http://localhost:8000/download-recipe-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          recipe: recipe,
          title: recipeData?.title || "Generated Recipe",
          language: language
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to download PDF");
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recipe_${language}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Animated Header */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex items-center justify-between relative overflow-hidden"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {/* Animated bubbles in background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10 backdrop-blur-md"
                style={{
                  width: Math.random() * 60 + 20,
                  height: Math.random() * 60 + 20,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-3 z-10">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChefHat className="text-white h-8 w-8" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Culinary AI
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="ml-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full"
            >
              <span className="text-white text-xs font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </span>
            </motion.div>
          </div>
          
          <div className="flex gap-2 items-center z-10">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <Globe className="h-4 w-4" />
                <span>{LANGUAGES.find(l => l.code === language)?.name || 'English'}</span>
              </motion.button>
              
              <AnimatePresence>
                {showLanguageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden border border-purple-100"
                  >
                    {LANGUAGES.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ backgroundColor: "#f3f0ff" }}
                        className={`w-full text-left px-4 py-2 transition ${
                          language === lang.code ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        {lang.name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tab buttons */}
            <div className="flex rounded-full bg-white/20 backdrop-blur-md p-1">
              {["ingredients", "image", "recipe"].map((tab) => {
                // Skip recipe tab if no recipe
                if (tab === "recipe" && !recipe) return null;
                
                let tabName = tab === "ingredients" 
                  ? getTranslatedText('ingredients', language)
                  : tab === "image" 
                    ? getTranslatedText('uploadImage', language)
                    : getTranslatedText('recipe', language);
                
                return (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-1.5 rounded-full font-medium transition relative ${
                      activeTab === tab
                        ? "bg-white text-indigo-700"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tabName}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          className="p-6 bg-gradient-to-b from-white to-gray-50"
          animate={controls}
        >
          <AnimatePresence mode="wait">
            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <motion.h2 
                  variants={itemVariants} 
                  className="text-2xl font-semibold text-gray-800 flex items-center gap-2"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {getTranslatedText('whatInKitchen', language)}
                  </span>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, 0, -10, 0],
                      transition: { repeat: Infinity, duration: 2.5 }
                    }}
                  >
                    <Utensils className="text-indigo-400 h-5 w-5" />
                  </motion.div>
                </motion.h2>
                
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute text-indigo-400 top-3 left-3 h-5 w-5">
                    <Search className="h-full w-full" />
                  </div>
                  <textarea
                    className="w-full p-4 pl-12 pr-12 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition h-32 resize-none shadow-sm bg-white"
                    placeholder={
                      language === 'es' ? 'Ingrese ingredientes separados por comas, o háblelos' : 
                      language === 'fr' ? 'Entrez les ingrédients séparés par des virgules, ou dites-les' : 
                      language === 'de' ? 'Zutaten durch Kommas getrennt eingeben oder sprechen' : 
                      'Enter ingredients separated by commas, or speak them'
                    }
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute right-3 top-3 p-2 rounded-full transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    }`}
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Speak ingredients'}
                    disabled={isProcessing}
                  >
                    <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                    {isListening && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.button>
                </motion.div>
                
                {ingredientList.length > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl"
                  >
                    <h3 className="text-sm font-medium text-indigo-700 mb-3 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      {language === 'es' ? 'Tus ingredientes:' : 
                       language === 'fr' ? 'Vos ingrédients:' : 
                       language === 'de' ? 'Deine Zutaten:' : 
                       'Your ingredients:'}
                    </h3>
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {ingredientList.map((item, index) => (
                        <motion.span
                          key={index}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          className="bg-white text-indigo-800 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 shadow-sm border border-indigo-100"
                        >
                          {item}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => {
                              const newList = ingredientList.filter(
                                (_, i) => i !== index
                              );
                              setIngredients(newList.join(", "));
                            }}
                            className="ml-1 text-indigo-400 hover:text-indigo-600"
                          >
                            <X className="h-4 w-4" />
                          </motion.button>
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* Quick suggestion chips */}
                <motion.div variants={itemVariants} className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {["chicken, rice, broccoli", "pasta, tomatoes, garlic", "eggs, cheese, spinach", "tofu, soy sauce, vegetables"].map((suggestion, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm shadow-sm border border-indigo-100"
                        onClick={() => setIngredients(suggestion)}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "image" && (
              <motion.div
                key="image"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <motion.h2 
                  variants={itemVariants}
                  className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6"
                >
                  {language === 'es' ? 'Sube una imagen de comida' : 
                   language === 'fr' ? 'Téléchargez une image de nourriture' : 
                   language === 'de' ? 'Lade ein Essensbild hoch' : 
                   'Upload a food image'}
                </motion.h2>
                
                <motion.div
                  variants={itemVariants}
                  className="border-2 border-dashed border-indigo-300 rounded-xl p-8 flex flex-col items-center gap-6 bg-gradient-to-r from-violet-50 to-indigo-50"
                >
                  {!imagePreview ? (
                    <>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ 
                          scale: [0.8, 1, 0.8],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="bg-white p-4 rounded-full shadow-md"
                      >
                        <ImageIcon className="h-12 w-12 text-indigo-500" />
                      </motion.div>
                      <motion.div
                        className="relative overflow-hidden"
                        whileHover={{ scale: 1.03 }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                        />
                        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-6 rounded-lg shadow-md flex items-center gap-2">
                          <span>Choose an image</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </motion.div>
                      <p className="text-gray-500 text-sm text-center max-w-md">
                        Upload a clear photo of your ingredients, fridge contents, or a dish you'd like to recreate!
                      </p>
                    </>
                  ) : (
                    <motion.div 
                      className="w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="relative rounded-lg overflow-hidden w-full max-w-md mx-auto shadow-lg">
                        <img 
                          src={imagePreview} 
                          alt="Selected food" 
                          className="w-full h-64 object-cover"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-5 w-5 text-indigo-700" />
                        </motion.button>
                      </div>
                      <p className="text-center text-indigo-700 font-medium mt-4">
                        {imageFile.name}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="flex justify-center mt-4"
                >
                  <p className="max-w-md text-center text-sm text-gray-500 bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-center">
                    <HelpCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                    Our AI will analyze your image and identify ingredients or dishes to create a custom recipe just for you.
                  </p>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "recipe" && recipe && (
              <motion.div
                key="recipe"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: 50 }}
                className="relative"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                  {/* Recipe header with animation */}
                  <div className="h-56 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                    {/* Animated background particles */}
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute bg-white/20 rounded-full"
                        style={{
                          width: Math.random() * 30 + 5,
                          height: Math.random() * 30 + 5,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, Math.random() * -50 - 20],
                          x: [0, (Math.random() - 0.5) * 40],
                          opacity: [0, 0.7, 0],
                          scale: [0, 1, 0.5]
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: Math.random() * 3
                        }}
                      />
                    ))}
                    
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                        className="bg-white/30 backdrop-blur-md p-6 rounded-full shadow-lg mb-4"
                      >
                        <ChefHat className="text-white h-12 w-12" />
                      </motion.div>
                      <motion.h1 
                        className="text-2xl md:text-3xl font-bold text-white text-center mx-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {recipeData?.title || "Your Delicious Recipe"}
                      </motion.h1>
                      
                      {/* Recipe tags */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <RecipeTags tags={recipeData?.tags} language={language} />
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {/* Recipe metadata */}
                    <motion.div 
                      variants={fadeVariants}
                      className="flex flex-wrap gap-4 mb-8 justify-center"
                    >
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 p-3 px-5 rounded-xl shadow-sm">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        <span className="text-indigo-800 font-medium">
                          {recipeData?.preparationTime || "30 mins"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 p-3 px-5 rounded-xl shadow-sm">
                        <Users className="h-5 w-5 text-indigo-600" />
                        <span className="text-indigo-800 font-medium">
                          {recipeData?.servings || 4} {
                            language === 'es' ? 'porciones' : 
                            language === 'fr' ? 'portions' : 
                            language === 'de' ? 'Portionen' : 
                            'servings'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 p-3 px-5 rounded-xl shadow-sm">
                        <GaugeCircle className="h-5 w-5 text-indigo-600" />
                        <span className="text-indigo-800 font-medium">
                          {recipeData?.difficulty || "Easy"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 p-3 px-5 rounded-xl shadow-sm">
                        <Flame className="h-5 w-5 text-indigo-600" />
                        <span className="text-indigo-800 font-medium">
                          {recipeData?.calories || 320} kcal
                        </span>
                      </div>
                    </motion.div>
                    
                    {/* Grid layout for recipe content and nutritional info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div 
                        className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        variants={fadeVariants}
                      >
                        <div className="prose prose-indigo prose-lg max-w-none mt-4 recipe-content">
                          <ReactMarkdown>{recipe}</ReactMarkdown>
                        </div>
                      </motion.div>
                      
                      {/* Side column with nutritional info */}
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                      >
                        <motion.div variants={itemVariants}>
                          <NutritionFacts language={language} />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <HealthMeter score={recipeData?.healthScore} language={language} />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-6 flex gap-3 justify-center"
                  variants={fadeVariants}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                    onClick={downloadPDF}
                  >
                    <Download className="h-5 w-5" />
                    {language === 'es' ? 'Descargar PDF' : 
                     language === 'fr' ? 'Télécharger PDF' : 
                     language === 'de' ? 'PDF herunterladen' : 
                     'Download PDF'}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white text-indigo-700 border border-indigo-300 px-6 py-3 rounded-xl shadow hover:shadow-md transition flex items-center justify-center gap-2"
                    onClick={() => setActiveTab("ingredients")}
                  >
                    <Sparkles className="h-5 w-5" />
                    {language === 'es' ? 'Nueva Receta' : 
                     language === 'fr' ? 'Nouvelle Recette' : 
                     language === 'de' ? 'Neues Rezept' : 
                     'New Recipe'}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          {(activeTab === "ingredients" || activeTab === "image") && (
            <motion.button
              animate={buttonControls}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 w-full md:w-auto mx-auto"
              onClick={generate}
              disabled={
                loading ||
                (activeTab === "ingredients" && !ingredients.trim()) ||
                (activeTab === "image" && !imageFile)
              }
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span className="font-medium">
                    {language === 'es' ? 'Creando magia culinaria...' : 
                     language === 'fr' ? 'Création de magie culinaire...' : 
                     language === 'de' ? 'Kulinarische Magie wird erschaffen...' : 
                     'Creating culinary magic...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">
                    {language === 'es' ? 'Crear Receta Mágica' : 
                     language === 'fr' ? 'Créer une Recette Magique' : 
                     language === 'de' ? 'Magisches Rezept Erstellen' : 
                     'Create Magical Recipe'}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RecipeGenerator;