import re
from fpdf import FPDF
from datetime import datetime

def generate_recipe_pdf(recipe_data, output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "AI-Generated Recipe", ln=True, align="C")
    pdf.ln(10)
    
    recipe = recipe_data.get("recipe", "")
    title = recipe_data.get("title", "Recipe")
    
    # Add title
    pdf.set_font("Arial", "B", 14)
    pdf.cell(200, 10, title, ln=True)
    pdf.ln(5)
    
    # Process sections
    sections = recipe.split("## ")
    for section in sections:
        if not section.strip():
            continue
            
        if "\n" in section:
            section_title, *content = section.split("\n", 1)
            content = "\n".join(content).strip()
        else:
            section_title = section
            content = ""
            
        # Add section title
        pdf.set_font("Arial", "B", 12)
        pdf.cell(200, 10, section_title, ln=True)
        
        # Add content
        if content:
            pdf.set_font("Arial", "", 12)
            pdf.multi_cell(0, 10, content)
            pdf.ln(5)
    
    # Footer
    pdf.set_y(-15)
    pdf.set_font("Arial", "I", 8)
    pdf.cell(0, 10, f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 0, "C")
    
    pdf.output(output_path)