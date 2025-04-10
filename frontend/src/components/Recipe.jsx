import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import ReactMarkdown from "react-markdown";

function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsProcessingVoice(true);
          speak("I'm listening, please say your ingredients now");
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setIngredients(prev => prev ? `${prev}, ${transcript}` : transcript);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setIsProcessingVoice(false);
          speak("Sorry, I didn't catch that. Please try again.");
        };

        recognition.onend = () => {
          setIsListening(false);
          setIsProcessingVoice(false);
        };

        setSpeechRecognition(recognition);
      }
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!speechRecognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }
    
    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        alert("Please allow microphone access to use voice input");
      }
    }
  };

  const generate = async () => {
    if (!ingredients.trim() && !imageFile) return;
    setLoading(true);

    try {
      let res;
      if (activeTab === "ingredients") {
        res = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", imageFile);

        res = await fetch("http://localhost:8000/generate-from-image", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      setRecipe(data.recipe);
      setActiveTab("recipe");
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const ingredientList = ingredients
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const downloadPDF = async () => {
    try {
      const res = await fetch("http://localhost:8000/download-recipe-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          recipe: recipe,
          title: "Generated Recipe"
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to download PDF");
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "recipe.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto rounded-2xl bg-white shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-amber-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="text-white h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">Culinary AI</h1>
          </div>
          <div className="flex gap-2">
            {["ingredients", "image"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  activeTab === tab
                    ? "bg-white text-amber-600"
                    : "bg-amber-600 text-white"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "ingredients" ? "Ingredients" : "Upload Image"}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeTab === "recipe"
                  ? "bg-white text-amber-600"
                  : "bg-amber-600 text-white"
              }`}
              onClick={() => setActiveTab("recipe")}
              disabled={!recipe}
            >
              Recipe
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  What's in your kitchen?
                </h2>
                <div className="relative">
                  <Search className="absolute text-gray-400 top-3 left-3 h-5 w-5" />
                  <textarea
                    className="w-full p-3 pl-10 pr-12 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none transition h-32 resize-none"
                    placeholder="Enter ingredients separated by commas, or speak them"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute right-3 top-3 p-2 rounded-full ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-amber-100 text-amber-600'
                    }`}
                    onClick={toggleListening}
                    title={isListening ? "Stop listening" : "Speak ingredients"}
                    disabled={isProcessingVoice}
                  >
                    <Mic className={`h-5 w-5 ${isProcessingVoice ? 'animate-pulse' : ''}`} />
                  </motion.button>
                </div>
                {ingredientList.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Your ingredients:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ingredientList.map((item, index) => (
                        <span
                          key={index}
                          className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {item}
                          <button
                            onClick={() => {
                              const newList = ingredientList.filter(
                                (_, i) => i !== index
                              );
                              setIngredients(newList.join(", "));
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "image" && (
              <motion.div
                key="image"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Upload a food image
                </h2>
                <div className="border-2 border-dashed border-amber-300 rounded-xl p-4 flex flex-col items-center gap-4">
                  <ImageIcon className="h-12 w-12 text-amber-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  {imageFile && (
                    <p className="text-sm text-gray-600">{imageFile.name}</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "recipe" && recipe && (
              <motion.div
                key="recipe"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative"
              >
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-amber-300 to-orange-300 relative flex items-center justify-center">
                    <div className="bg-white/30 backdrop-blur-sm p-8 rounded-full">
                      <ChefHat className="text-white h-12 w-12" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-amber-50 p-2 px-4 rounded-full">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-800 text-sm">30 mins</span>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 p-2 px-4 rounded-full">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-800 text-sm">
                          4 servings
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 p-2 px-4 rounded-full">
                        <BookOpen className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-800 text-sm">Easy</span>
                      </div>
                    </div>
                    <div className="prose prose-amber prose-lg max-w-none mt-4 recipe-content">
                      <ReactMarkdown>{recipe}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-xl shadow hover:bg-amber-700 transition"
                  onClick={downloadPDF}
                >
                  Download Recipe as PDF
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 w-full md:w-auto"
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
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Creating recipe...</span>
              </>
            ) : (
              <>
                <span>Generate Recipe</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default RecipeGenerator;