from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.genai_service import generate_recipe, analyze_and_generate_recipe_from_image



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
