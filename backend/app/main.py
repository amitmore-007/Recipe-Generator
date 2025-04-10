from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.genai_service import generate_recipe, analyze_and_generate_recipe_from_image
from app.pdf_generator import generate_recipe_pdf
from fastapi.responses import FileResponse
import uuid
import os




app = FastAPI()

# ✅ CORS
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Pydantic model for Swagger + validation
class RecipeRequest(BaseModel):
    ingredients: str

@app.post("/generate")
async def generate(request: RecipeRequest):
    return generate_recipe(request.ingredients)

@app.post("/generate-from-image")
async def generate_from_image(file: UploadFile = File(...)):
    return await analyze_and_generate_recipe_from_image(file)

@app.post("/download-recipe-pdf")
async def download_recipe_pdf(recipe_data: dict):
    try:
        file_id = str(uuid.uuid4())
        output_path = f"generated/recipe_{file_id}.pdf"
        os.makedirs("generated", exist_ok=True)
        
        generate_recipe_pdf(recipe_data, output_path)
        
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename=f"recipe_{file_id}.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))