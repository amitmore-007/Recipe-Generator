import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from fastapi import HTTPException

load_dotenv()
print("API Key:", os.getenv("GEMINI_API_KEY"))  # Add this line
genai.configure(api_key="AIzaSyDUnxCu_FcMUmpSl4LO5j-gv4pAGTpe3cg")

model = genai.GenerativeModel("gemini-1.5-flash")

def generate_recipe(ingredients, language="en"):
    # Complete language-specific prompts
    prompts = {
        "en": f"""
        You are a professional chef. Create a full recipe using only: {ingredients}.
        Include in English:
        - Recipe Title
        - Description
        - Ingredients List
        - Detailed Step-by-step Instructions
        - Nutritional Info (calories, protein, carbs, fats)
        - Cooking Time
        Format as clean Markdown with ## headings for each section.
        """,
        "es": f"""
        Eres un chef profesional. Crea una receta usando solo: {ingredients}.
        Incluye en español:
        - Título de la receta
        - Descripción
        - Lista de ingredientes
        - Instrucciones paso a paso
        - Información nutricional (calorías, proteínas, carbohidratos, grasas)
        - Tiempo de cocción
        Formato Markdown con ## encabezados para cada sección.
        """,
        "fr": f"""
        Vous êtes un chef professionnel. Créez une recette complète en utilisant uniquement: {ingredients}.
        Incluez en français:
        - Titre de la recette
        - Description
        - Liste des ingrédients
        - Instructions détaillées étape par étape
        - Informations nutritionnelles (calories, protéines, glucides, lipides)
        - Temps de cuisson
        Format Markdown avec des en-têtes ## pour chaque section.
        """,
        "de": f"""
        Sie sind ein professioneller Koch. Erstellen Sie ein vollständiges Rezept mit nur: {ingredients}.
        Enthalten Sie auf Deutsch:
        - Rezepttitel
        - Beschreibung
        - Zutatenliste
        - Detaillierte Schritt-für-Schritt-Anleitung
        - Nährwertangaben (Kalorien, Eiweiß, Kohlenhydrate, Fette)
        - Kochzeit
        Formatieren Sie es als Markdown mit ## Überschriften für jeden Abschnitt.
        """,
        "it": f"""
        Sei uno chef professionista. Crea una ricetta completa usando solo: {ingredients}.
        Includi in italiano:
        - Titolo della ricetta
        - Descrizione
        - Lista degli ingredienti
        - Istruzioni dettagliate passo dopo passo
        - Informazioni nutrizionali (calorie, proteine, carboidrati, grassi)
        - Tempo di cottura
        Formattalo come Markdown con intestazioni ## per ogni sezione.
        """,
        "pt": f"""
        Você é um chef profissional. Crie uma receita completa usando apenas: {ingredients}.
        Inclua em português:
        - Título da receita
        - Descrição
        - Lista de ingredientes
        - Instruções detalhadas passo a passo
        - Informações nutricionais (calorias, proteínas, carboidratos, gorduras)
        - Tempo de cozimento
        Formate como Markdown com cabeçalhos ## para cada seção.
        """,
        "hi": f"""
        आप एक पेशेवर शेफ हैं। केवल इन सामग्रियों का उपयोग करके एक पूर्ण रेसिपी बनाएं: {ingredients}.
        हिंदी में शामिल करें:
        - रेसिपी का शीर्षक
        - विवरण
        - सामग्री सूची
        - विस्तृत चरण-दर-चरण निर्देश
        - पोषण संबंधी जानकारी (कैलोरी, प्रोटीन, कार्ब्स, वसा)
        - पकाने का समय
        प्रत्येक अनुभाग के लिए ## हेडिंग के साथ मार्कडाउन के रूप में प्रारूपित करें।
        """,
        "ja": f"""
        あなたはプロのシェフです。次の材料のみを使用して完全なレシピを作成してください: {ingredients}.
        日本語で含めるもの:
        - レシピタイトル
        - 説明
        - 材料リスト
        - 詳細なステップバイステップの手順
        - 栄養情報 (カロリー、タンパク質、炭水化物、脂肪)
        - 調理時間
        各セクションに##見出しを付けてMarkdown形式でフォーマットしてください。
        """,
        "zh": f"""
        你是一位专业厨师。仅使用以下材料创建完整食谱: {ingredients}.
        用中文包括:
        - 食谱标题
        - 描述
        - 配料表
        - 详细的分步说明
        - 营养信息(卡路里、蛋白质、碳水化合物、脂肪)
        - 烹饪时间
        使用Markdown格式，每个部分用##标题。
        """,
        "ar": f"""
        أنت طاهٍ محترف. أنشئ وصفة كاملة باستخدام: {ingredients} فقط.
        قم بتضمين باللغة العربية:
        - عنوان الوصفة
        - الوصف
        - قائمة المكونات
        - تعليمات مفصلة خطوة بخطوة
        - المعلومات الغذائية (السعرات الحرارية، البروتين، الكربوهيدرات، الدهون)
        - وقت الطهي
        قم بتنسيقه كـ Markdown مع عناوين ## لكل قسم.
        """,
        "ru": f"""
        Вы профессиональный шеф-повар. Создайте полный рецепт, используя только: {ingredients}.
        Включите на русском:
        - Название рецепта
        - Описание
        - Список ингредиентов
        - Подробные пошаговые инструкции
        - Пищевая ценность (калории, белки, углеводы, жиры)
        - Время приготовления
        Форматируйте как Markdown с заголовками ## для каждого раздела.
        """,
        "ko": f"""
        당신은 전문 셰프입니다. 다음 재료만 사용하여 완전한 레시피를 만드세요: {ingredients}.
        한국어로 포함할 내용:
        - 레시피 제목
        - 설명
        - 재료 목록
        - 상세한 단계별 지침
        - 영양 정보 (칼로리, 단백질, 탄수화물, 지방)
        - 조리 시간
        각 섹션에 ## 제목을 사용하여 Markdown 형식으로 작성하세요.
        """,
        "mr": f"""
तुम्ही एक व्यावसायिक स्वयंपाकी आहात. फक्त या साहित्याचा वापर करून एक पूर्ण पाककृती तयार करा: {ingredients}.
मराठीत समाविष्ट करा:
- पाककृतीचे शीर्षक
- वर्णन
- साहित्य यादी
- तपशीलवार चरण-दर-चरण सूचना
- पोषण माहिती (कॅलरी, प्रथिने, कर्बोदके, चरबी)
- स्वयंपाक करण्याची वेळ
प्रत्येक विभागासाठी ## शीर्षकांसह मार्कडाउन स्वरूपात लिहा.
""",

    }
    
    prompt = prompts.get(language, prompts["en"])
    response = model.generate_content(prompt)
    return {"recipe": response.text, "language": language}

async def analyze_and_generate_recipe_from_image(file_data, language="en"):
    # Complete language-specific prompts
    nutrition_prompts = {
        "en": "Analyze this food image and return JSON with ingredients and nutrition info in English",
        "es": "Analiza esta imagen de comida y devuelve JSON con ingredientes e información nutricional en español",
        "fr": "Analysez cette image de nourriture et renvoyez un JSON avec les ingrédients et les informations nutritionnelles en français",
        "de": "Analysieren Sie dieses Lebensmittelbild und geben Sie JSON mit Zutaten und Nährwertangaben auf Deutsch zurück",
        "it": "Analizza questa immagine di cibo e restituisci JSON con ingredienti e informazioni nutrizionali in italiano",
        "pt": "Analise esta imagem de comida e retorne JSON com ingredientes e informações nutricionais em português",
        "hi": "इस भोजन की छवि का विश्लेषण करें और हिंदी में सामग्री और पोषण संबंधी जानकारी के साथ JSON लौटाएं",
        "ja": "この食品画像を分析し、日本語で材料と栄養情報を含むJSONを返してください",
        "zh": "分析这张食物图片并返回包含中文的配料和营养信息的JSON",
        "ar": "حلل صورة الطعام هذه وقم بإرجاع JSON مع المكونات والمعلومات الغذائية باللغة العربية",
        "ru": "Проанализируйте это изображение еды и верните JSON с ингредиентами и информацией о питании на русском языке",
        "ko": "이 음식 이미지를 분석하고 한국어로 재료와 영양 정보가 포함된 JSON을 반환하세요",
        "mr": "या अन्नाच्या प्रतिमेचे विश्लेषण करा आणि मराठीत साहित्य आणि पोषण माहितीसह JSON परत करा",
    }
    
    recipe_prompts = {
        "en": "Create a full recipe in English with Markdown formatting including all sections",
        "es": "Crea una receta completa en español con formato Markdown incluyendo todas las secciones",
        "fr": "Créez une recette complète en français avec mise en forme Markdown incluant toutes les sections",
        "de": "Erstellen Sie ein vollständiges Rezept auf Deutsch mit Markdown-Formatierung, einschließlich aller Abschnitte",
        "it": "Crea una ricetta completa in italiano con formattazione Markdown includendo tutte le sezioni",
        "pt": "Crie uma receita completa em português com formatação Markdown incluindo todas as seções",
        "hi": "सभी अनुभागों सहित मार्कडाउन फ़ॉर्मेटिंग के साथ हिंदी में एक पूर्ण रेसिपी बनाएं",
        "ja": "すべてのセクションを含むMarkdown形式で日本語で完全なレシピを作成してください",
        "zh": "使用Markdown格式创建包含所有部分的中文完整食谱",
        "ar": "قم بإنشاء وصفة كاملة باللغة العربية بتنسيق Markdown تتضمن جميع الأقسام",
        "ru": "Создайте полный рецепт на русском языке с разметкой Markdown, включая все разделы",
        "ko": "모든 섹션을 포함한 Markdown 형식으로 한국어로 완전한 레시피를 만드세요",
        "mr": "सर्व विभागांसह मार्कडाउन स्वरूपनासह मराठीत एक पूर्ण पाककृती तयार करा"
    }

    try:
        contents = await file_data.read()
        
        # Step 1: Nutrition analysis
        response1 = model.generate_content([
            nutrition_prompts.get(language, nutrition_prompts["en"]),
            {"mime_type": "image/jpeg", "data": contents}
        ])
        
        # Clean JSON response
        text_result = response1.text
        if "```json" in text_result:
            text_result = text_result.split("```json")[1].split("```")[0].strip()
        elif "```" in text_result:
            text_result = text_result.split("```")[1].split("```")[0].strip()
        
        nutrition_data = json.loads(text_result)
        ingredients_str = ", ".join(nutrition_data.get("ingredients", []))

        # Step 2: Generate recipe
        prompt = f"""
        {recipe_prompts.get(language, recipe_prompts["en"])} using: {ingredients_str}.
        Include:
        - Title
        - Description
        - Ingredients
        - Instructions
        - Nutrition
        - Cooking Time
        """
        response2 = model.generate_content(prompt)
        
        return {
            "nutrition": nutrition_data,
            "recipe": response2.text,
            "language": language
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))