from fpdf import FPDF
from datetime import datetime
import re

def clean_markdown(text):
    """Remove markdown formatting while preserving structure"""
    # Remove headers
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    # Remove bold/italic
    text = text.replace('**', '').replace('__', '')
    # Remove lists markers
    text = re.sub(r'^\s*[\*\-\+] ', '• ', text, flags=re.MULTILINE)
    return text.strip()

def generate_recipe_pdf(recipe_data, output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Set font based on language (example for RTL languages)
    language = recipe_data.get("language", "en")
    if language in ["ar", "he"]:  # Right-to-left languages
        pdf.set_rtl(True)
    
    # Title
    pdf.set_font("Arial", "B", 18)
    pdf.cell(0, 10, "AI-Generated Recipe", ln=True, align="C")
    pdf.ln(10)
    
    # Process recipe text
    recipe_text = recipe_data.get("recipe", "")
    cleaned_text = clean_markdown(recipe_text)
    
    # Split into sections
    sections = re.split(r'\n\s*\n', cleaned_text)
    
    for section in sections:
        if not section.strip():
            continue
            
        # Detect section headers
        if ":" in section and len(section.split(":")) > 1:
            title, content = section.split(":", 1)
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, title.strip() + ":", ln=True)
            pdf.set_font("Arial", "", 12)
            pdf.multi_cell(0, 8, content.strip())
        else:
            pdf.set_font("Arial", "", 12)
            pdf.multi_cell(0, 8, section.strip())
        
        pdf.ln(5)
    
    # Footer
    pdf.set_y(-15)
    pdf.set_font("Arial", "I", 8)
    pdf.cell(0, 10, f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 0, "C")
    
    pdf.output(output_path)