import { useState, useEffect, useRef } from "react";
import { Mic, Image as ImageIcon, Globe, Download, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TRANSLATIONS = {
  appTitle: {
    en: 'Culinary AI',
    mr: 'पाककृती AI'
  },
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
    ar: 'मकनत', 
    ru: 'Ингредиенты', 
    ko: '재료',
    mr: 'साहित्य' 
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
    ar: 'تحميل صورة', 
    ru: 'Загрузить изображение', 
    ko: '이미지 업로드',
    mr: 'प्रतिमा अपलोड करा' 
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
    ar: 'وصفة', 
    ru: 'Рецепт', 
    ko: '레시피',
    mr: 'पाककृती' 
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
    ar: 'ماذا لديك في مطبخك؟', 
    ru: 'Что есть на вашей кухне?', 
    ko: '주방에 어떤 재료가 있나요?',
    mr: 'तुमच्या स्वयंपाकघरात काय आहे?' 
  },
  voicePlaceholder: { 
    en: 'Enter ingredients separated by commas, or speak them', 
    es: 'Ingrese ingredientes separados por comas, o háblelos', 
    fr: 'Entrez les ingrédients séparés par des virgules, ou dites-les', 
    de: 'Zutaten durch Kommas getrennt eingeben oder sprechen', 
    it: 'Inserisci gli ingredienti separati da virgole, o parlali', 
    pt: 'Digite ingredientes separados por vírgulas ou fale-os', 
    hi: 'सामग्री को अल्पविराम से अलग करके दर्ज करें, या उन्हें बोलें', 
    ja: '材料をカンマで区切って入力するか、話してください', 
    zh: '输入用逗号分隔的成分，或者说出来', 
    ar: 'أدخل المكونات مفصولة بفواصل، أو قلها', 
    ru: 'Введите ингредиенты через запятую или продиктуйте их', 
    ko: '재료를 쉼표로 구분하여 입력하거나 말하세요',
    mr: 'साहित्य स्वल्पविरामाने विभक्त करून प्रविष्ट करा किंवा ते बोला' 
  },
  speakIngredients: { 
    en: 'Speak ingredients', 
    es: 'Hablar ingredientes', 
    fr: 'Dicter les ingrédients', 
    de: 'Zutaten diktieren', 
    it: 'Dettare ingredienti', 
    pt: 'Ditar ingredientes', 
    hi: 'सामग्री बोलें', 
    ja: '材料を話す', 
    zh: '说出成分', 
    ar: 'تحدث المكونات', 
    ru: 'Продиктовать ингредиенты', 
    ko: '재료 말하기',
    mr: 'साहित्य बोला' 
  },
  stopListening: { 
    en: 'Stop listening', 
    es: 'Dejar de escuchar', 
    fr: 'Arrêter d\'écouter', 
    de: 'Aufhören zuzuhören', 
    it: 'Smetti di ascoltare', 
    pt: 'Parar de ouvir', 
    hi: 'सुनना बंद करें', 
    ja: '聞くのをやめる', 
    zh: '停止聆听', 
    ar: 'توقف عن الاستماع', 
    ru: 'Прекратить слушать', 
    ko: '듣기 중지',
    mr: 'ऐकणे थांबवा' 
  },
  creatingRecipe: { 
    en: 'Creating recipe...', 
    es: 'Creando receta...', 
    fr: 'Création de recette...', 
    de: 'Rezept wird erstellt...', 
    it: 'Creando ricetta...', 
    pt: 'Criando receita...', 
    hi: 'रेसिपी बना रहे हैं...', 
    ja: 'レシピを作成中...', 
    zh: '正在创建食谱...', 
    ar: 'جارٍ إنشاء الوصفة...', 
    ru: 'Создание рецепта...', 
    ko: '레시피 생성 중...',
    mr: 'पाककृती तयार करत आहे...' 
  },
  createRecipe: { 
    en: 'Create Recipe', 
    es: 'Crear Receta', 
    fr: 'Créer Recette', 
    de: 'Rezept Erstellen', 
    it: 'Crea Ricetta', 
    pt: 'Criar Receita', 
    hi: 'रेसिपी बनाएं', 
    ja: 'レシピを作成', 
    zh: '创建食谱', 
    ar: 'إنشاء وصفة', 
    ru: 'Создать Рецепт', 
    ko: '레시피 만들기',
    mr: 'पाककृती तयार करा' 
  },
  downloadPDF: { 
    en: 'Download PDF', 
    es: 'Descargar PDF', 
    fr: 'Télécharger PDF', 
    de: 'PDF herunterladen', 
    it: 'Scarica PDF', 
    pt: 'Baixar PDF', 
    hi: 'PDF डाउनलोड करें', 
    ja: 'PDFをダウンロード', 
    zh: '下载PDF', 
    ar: 'تحميل PDF', 
    ru: 'Скачать PDF', 
    ko: 'PDF 다운로드',
    mr: 'PDF डाउनलोड करा' 
  },
  newRecipe: { 
    en: 'New Recipe', 
    es: 'Nueva Receta', 
    fr: 'Nouvelle Recette', 
    de: 'Neues Rezept', 
    it: 'Nuova Ricetta', 
    pt: 'Nova Receita', 
    hi: 'नई रेसिपी', 
    ja: '新しいレシピ', 
    zh: '新食谱', 
    ar: 'وصفة جديدة', 
    ru: 'Новый Рецепт', 
    ko: '새로운 레시피',
    mr: 'नवीन पाककृती' 
  },
  chooseImage: { 
    en: 'Choose image', 
    es: 'Elegir imagen', 
    fr: 'Choisir image', 
    de: 'Bild auswählen', 
    it: 'Scegli immagine', 
    pt: 'Escolher imagem', 
    hi: 'छवि चुनें', 
    ja: '画像を選択', 
    zh: '选择图片', 
    ar: 'اختر صورة', 
    ru: 'Выбрать изображение', 
    ko: '이미지 선택',
    mr: 'प्रतिमा निवडा' 
  },
  imageUploadHint: { 
    en: 'Upload a clear photo of your ingredients or dish', 
    es: 'Sube una foto clara de tus ingredientes o plato', 
    fr: 'Téléchargez une foto claire de vos ingrédients ou plat', 
    de: 'Laden Sie ein klares Foto Ihrer Zutaten oder Gerichts hoch', 
    it: 'Carica una foto chiara dei tuoi ingredienti o piatto', 
    pt: 'Envie uma foto clara dos seus ingredientes ou prato', 
    hi: 'अपने सामग्री या डिश की एक स्पष्ट तस्वीर अपलोड करें', 
    ja: '材料や料理の鮮明な写真をアップロードしてください', 
    zh: '上传您的食材或菜肴的清晰照片', 
    ar: 'قم بتحميل صورة واضحة للمكونات أو الطبق', 
    ru: 'Загрузите четкое фото ваших ингредиентов или блюда', 
    ko: '재료 또는 요리의 선명한 사진을 업로드하세요',
    mr: 'तुमच्या साहित्य किंवा डिशची स्पष्ट फोटो अपलोड करा' 
  },
  noSpeechError: { 
    en: 'No speech detected', 
    es: 'No se detectó voz', 
    fr: 'Aucune voix détectée', 
    de: 'Keine Sprache erkannt', 
    it: 'Nessun parlato rilevato', 
    pt: 'Nenhuma fala detectada', 
    hi: 'कोई भाषण का पता नहीं चला', 
    ja: '音声が検出されませんでした', 
    zh: '未检测到语音', 
    ar: 'لم يتم الكشف عن كلام', 
    ru: 'Речь не обнаружена', 
    ko: '음성이 감지되지 않음',
    mr: 'भाषण आढळले नाही' 
  },
  micError: { 
    en: 'Microphone access denied', 
    es: 'Acceso al micrófono denegado', 
    fr: 'Accès au microphone refusé', 
    de: 'Mikrofonzugriff verweigert', 
    it: 'Accesso al microfono negato', 
    pt: 'Acesso ao microfone negado', 
    hi: 'माइक्रोफ़ोन एक्सेस अस्वीकृत', 
    ja: 'マイクへのアクセスが拒否されました', 
    zh: '麦克风访问被拒绝', 
    ar: 'تم رفض الوصول إلى الميكروفون', 
    ru: 'Доступ к микрофону запрещен', 
    ko: '마이크 액세스 거부됨',
    mr: 'मायक्रोफोन प्रवेश नाकारला' 
  },
  speechNotSupported: { 
    en: 'Speech recognition not supported in your browser', 
    es: 'Reconocimiento de voz no compatible en tu navegador', 
    fr: 'Reconnaissance vocale non prise en charge dans votre navigateur', 
    de: 'Spracherkennung wird in Ihrem Browser nicht unterstützt', 
    it: 'Riconoscimento vocale non supportato nel tuo browser', 
    pt: 'Reconhecimento de fala não suportado no seu navegador', 
    hi: 'आपके ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है', 
    ja: 'お使いのブラウザでは音声認識がサポートされていません', 
    zh: '您的浏览器不支持语音识别', 
    ar: 'التعرف على الكلام غير مدعوم في متصفحك', 
    ru: 'Распознавание речи не поддерживается в вашем браузере', 
    ko: '브라우저에서 음성 인식을 지원하지 않습니다',
    mr: 'तुमच्या ब्राउझरमध्ये भाषण ओळख समर्थित नाही' 
  }
};

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
];
function getTranslatedText(key, language) {
  return TRANSLATIONS[key]?.[language] || TRANSLATIONS[key]?.en || key;
}

function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [language, setLanguage] = useState('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Initialize voice recognition
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setVoiceError(getTranslatedText('speechNotSupported', language));
      return;
    }

    // Create new recognition instance
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    // Configure recognition settings
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Language mapping for speech recognition
    const langMap = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
      it: 'it-IT', pt: 'pt-PT', hi: 'hi-IN', ja: 'ja-JP',
      zh: 'zh-CN', ar: 'ar-SA', ru: 'ru-RU', ko: 'ko-KR'
    };
    recognition.lang = langMap[language] || 'en-US';

    // Event handlers
    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      
      setIngredients(prev => {
        // Clean up the transcript
        const cleaned = transcript
          .replace(/\band\b/gi, ',') // Replace "and" with commas
          .replace(/\s*,\s*/g, ', ') // Normalize spaces around commas
          .replace(/\s+/g, ' ')      // Collapse multiple spaces
          .trim();
          
        // If there's existing text, append with comma separation
        return prev ? `${prev}, ${cleaned}` : cleaned;
      });
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      switch(event.error) {
        case 'no-speech':
          setVoiceError(getTranslatedText('noSpeechError', language));
          break;
        case 'not-allowed':
        case 'permission-denied':
          setVoiceError(getTranslatedText('micError', language));
          break;
        default:
          setVoiceError(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart recognition if we're still supposed to be listening
        recognition.start();
      }
    };

    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isListening]);

  const toggleListening = () => {
    if (!isSpeechSupported) return;
    
    setVoiceError(null);
    
    if (isListening) {
      // Stop listening
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Start listening
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setVoiceError("Failed to start voice recognition: " + err.message);
        setIsListening(false);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Generate recipe
  const generateRecipe = async () => {
    if ((!ingredients.trim() && !imageFile) || loading) return;
    
    setLoading(true);
    try {
      let response;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("language", language);
        
        response = await fetch("http://localhost:8000/generate-from-image", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients, language }),
        });
      }
      
      const data = await response.json();
      setRecipe(data.recipe);
      setActiveTab("recipe");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/download-recipe-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe, language }),
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      
      // Check if response is PDF
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Invalid response format');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recipe_${language}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);
    } catch (err) {
      console.error("PDF download error:", err);
      alert(`Failed to download PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            {getTranslatedText('appTitle', language)}
          </h1>
          
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-1 bg-blue-700 text-white rounded"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              <Globe size={16} />
              <span>{LANGUAGES.find(l => l.code === language)?.flag}</span>
            </button>
            
            {showLangDropdown && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-40 max-h-60 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-100 ${
                      language === lang.code ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangDropdown(false);
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "ingredients" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("ingredients")}
            >
              {getTranslatedText('ingredients', language)}
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "image" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("image")}
            >
              {getTranslatedText('uploadImage', language)}
            </button>
            {recipe && (
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "recipe" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("recipe")}
              >
                {getTranslatedText('recipe', language)}
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === "ingredients" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {getTranslatedText('whatInKitchen', language)}
              </h2>
              
              <div className="relative">
                <textarea
                  className="w-full p-3 border rounded-lg"
                  placeholder={getTranslatedText('voicePlaceholder', language)}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  rows={4}
                />
                
                {isSpeechSupported ? (
                  <button
                    className={`absolute right-2 bottom-2 p-2 rounded-full ${
                      isListening ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                    } transition-colors`}
                    onClick={toggleListening}
                    title={isListening ? 
                      getTranslatedText('stopListening', language) : 
                      getTranslatedText('speakIngredients', language)}
                    disabled={!isSpeechSupported}
                  >
                    <Mic size={16} />
                    {isListening && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    )}
                  </button>
                ) : (
                  <button
                    className="absolute right-2 bottom-2 p-2 rounded-full bg-gray-200 cursor-not-allowed"
                    title={getTranslatedText('speechNotSupported', language)}
                  >
                    <Mic size={16} className="opacity-50" />
                  </button>
                )}
              </div>
              
              {voiceError && (
                <div className="text-red-500 text-sm">
                  {voiceError}
                </div>
              )}
            </div>
          )}

          {activeTab === "image" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {getTranslatedText('uploadImage', language)}
              </h2>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon size={48} className="text-gray-400" />
                      <span className="text-gray-500">
                        {getTranslatedText('chooseImage', language)}
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Uploaded food" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                {getTranslatedText('imageUploadHint', language)}
              </p>
            </div>
          )}

          {activeTab === "recipe" && recipe && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {getTranslatedText('recipe', language)}
                </h2>
                <div className="flex gap-2">
                  <button 
                    className="text-blue-600 text-sm"
                    onClick={downloadPDF}
                  >
                    {getTranslatedText('downloadPDF', language)}
                  </button>
                  <button 
                    className="text-blue-600 text-sm"
                    onClick={() => {
                      setActiveTab("ingredients");
                      setIngredients("");
                      setRecipe("");
                    }}
                  >
                    {getTranslatedText('newRecipe', language)}
                  </button>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <ReactMarkdown>{recipe}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {(activeTab === "ingredients" || activeTab === "image") && (
            <button
              className={`w-full mt-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                loading || (!ingredients.trim() && !imageFile)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors`}
              onClick={generateRecipe}
              disabled={loading || (!ingredients.trim() && !imageFile)}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  {getTranslatedText('creatingRecipe', language)}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {getTranslatedText('createRecipe', language)}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeGenerator;