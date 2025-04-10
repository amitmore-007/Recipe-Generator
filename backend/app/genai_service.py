import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from fastapi import HTTPException
import re  



load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def generate_recipe(ingredients):
    prompt = f"""
You are a professional chef. Create a full recipe using only the following ingredients: {ingredients}.
Include:
- Recipe Title
- Short Description
- Step-by-step Cooking Instructions
- Nutritional Breakdown (calories, protein, carbs, fats)
- Estimated Cooking and Preparation Time
Respond in clean Markdown format.
"""
    response = model.generate_content(prompt)
    return {"recipe": response.text}


async def analyze_and_generate_recipe_from_image(file_data):
    """
    Analyzes a food image to extract ingredients and nutritional info, then generates a recipe.
    Returns both nutrition data and the recipe.
    """
    nutrition_prompt = """
    You are a nutritionist AI assistant. Analyze the food in this image and return a JSON response with the following structure:
    {
        "ingredients": ["egg", "bread", "avocado"],  // Detected ingredients
        "foods": [
            {
                "name": "Food Item Name",
                "quantity": 1,
                "calories": 123,
                "protein": 10,
                "carbs": 20,
                "fats": 5,
                "fiber": 3,
                "sugar": 2,
                "isHealthy": true,
                "healthReason": "Brief explanation"
            }
        ],
        "overallAssessment": "Brief overall health assessment"
    }
    IMPORTANT: Only return valid JSON without markdown or explanations.
    """

    try:
        contents = await file_data.read()

        # Step 1: Get nutrition + ingredient list
        response1 = model.generate_content([nutrition_prompt, {"mime_type": "image/jpeg", "data": contents}])
        text_result = response1.text

        # Clean any markdown blocks
        if "```json" in text_result:
            text_result = text_result.split("```json")[1].split("```")[0].strip()
        elif "```" in text_result:
            text_result = text_result.split("```")[1].split("```")[0].strip()

        nutrition_data = json.loads(text_result)
        ingredients_list = nutrition_data.get("ingredients", [])
        ingredients_str = ", ".join(ingredients_list)

        # Step 2: Generate full recipe from ingredients
        recipe_prompt = f"""
        You are a professional chef. Create a full recipe using only the following ingredients: {ingredients_str}.
        Include:
        - Recipe Title
        - Short Description
        - Step-by-step Cooking Instructions
        - Nutritional Breakdown (calories, protein, carbs, fats)
        - Estimated Cooking and Preparation Time
        Respond in clean Markdown format.
        """
        response2 = model.generate_content(recipe_prompt)
        recipe_text = response2.text

        return {
            "nutrition": nutrition_data,
            "recipe": recipe_text
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze image and generate recipe.")
