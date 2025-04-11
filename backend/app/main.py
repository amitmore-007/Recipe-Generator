from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.genai_service import generate_recipe, analyze_and_generate_recipe_from_image
from app.pdf_generator import generate_recipe_pdf
from fastapi.responses import FileResponse
import uuid
import os
from pathlib import Path

app = FastAPI()

# CORS Configuration
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecipeRequest(BaseModel):
    ingredients: str
    language: str = "en"

@app.post("/generate")
async def generate(request: RecipeRequest):
    return generate_recipe(request.ingredients, request.language)

@app.post("/generate-from-image")
async def generate_from_image(
    file: UploadFile = File(...),
    language: str = "en"
):
    return await analyze_and_generate_recipe_from_image(file, language)

@app.post("/download-recipe-pdf")
async def download_recipe_pdf(recipe_data: dict):
    try:
        # Create a unique filename
        file_id = str(uuid.uuid4())
        filename = f"recipe_{recipe_data.get('language', 'en')}_{file_id}.pdf"
        
        # Create output directory if it doesn't exist
        output_dir = Path("generated")
        output_dir.mkdir(exist_ok=True)
        output_path = output_dir / filename
        
        # Generate the PDF
        generate_recipe_pdf(recipe_data, str(output_path))
        
        # Verify the file was created
        if not output_path.exists():
            raise HTTPException(status_code=500, detail="PDF generation failed")
        
        # Return the file response
        return FileResponse(
            path=output_path,
            filename=filename,
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))