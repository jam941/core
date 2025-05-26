#!/bin/bash

# Create necessary directories
mkdir -p temp
mkdir -p public/assets

# Copy the template and data files to temp directory
cp src/app/api/resume/template.tex temp/resume.tex
cp src/app/api/resume/data.json temp/data.json

# Navigate to temp directory
cd temp

# Use node to process the template with data
node -e "
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let template = fs.readFileSync('resume.tex', 'utf8');
for (const key in data) {
  if (typeof data[key] === 'string') {
    const regex = new RegExp(\`{{${key}}}\`, 'g');
    template = template.replace(regex, data[key]);
  }
}

if (data.education && Array.isArray(data.education)) {
  let educationContent = '';
  data.education.forEach((edu) => {
    let eduTemplate = '\\\\cventry{{{years}}}{{{degree}}}{{{institution}}}{{{location}}}{}{{{description}}}\\n';
    for (const key in edu) {
      const regex = new RegExp(\`{{${key}}}\`, 'g');
      eduTemplate = eduTemplate.replace(regex, edu[key]);
    }
    educationContent += eduTemplate;
  });
  template = template.replace(/{{#education}}([\\s\\S]*?){{\/education}}/g, educationContent);
}

if (data.experience && Array.isArray(data.experience)) {
  let experienceContent = '';
  data.experience.forEach((exp) => {
    let expTemplate = '\\\\cventry{{{years}}}{{{position}}}{{{company}}}{{{location}}}{}{\\\\begin{itemize}\\n';
    for (const key in exp) {
      if (key !== 'responsibilities') {
        const regex = new RegExp(\`{{${key}}}\`, 'g');
        expTemplate = expTemplate.replace(regex, exp[key]);
      }
    }
    
    if (exp.responsibilities && Array.isArray(exp.responsibilities)) {
      exp.responsibilities.forEach((resp) => {
        expTemplate += \`\\\\item ${resp}\\n\`;
      });
    }
    
    expTemplate += '\\\\end{itemize}}\\n';
    experienceContent += expTemplate;
  });
  template = template.replace(/{{#experience}}([\\s\\S]*?){{\/experience}}/g, experienceContent);
}

if (data.skills) {
  for (const key in data.skills) {
    const regex = new RegExp(\`{{skills.${key}}}\`, 'g');
    template = template.replace(regex, data.skills[key]);
  }
}

fs.writeFileSync('resume_processed.tex', template);
"

# Check if pdflatex is installed
if command -v pdflatex >/dev/null 2>&1; then
  # Compile the LaTeX file to PDF
  pdflatex resume_processed.tex
  pdflatex resume_processed.tex  # Run twice for references
  
  # Copy the PDF to the public directory
  cp resume_processed.pdf ../public/assets/resume.pdf
  
  echo "Resume compiled successfully! PDF is available at public/assets/resume.pdf"
else
  echo "Error: pdflatex is not installed."
  echo "To install on macOS, run: brew install --cask mactex"
  echo "To install on Ubuntu, run: sudo apt-get install texlive-full"
  echo "Once installed, run this script again."
  exit 1
fi

# Clean up temporary files
cd ..
rm -f temp/resume_processed.aux temp/resume_processed.log temp/resume_processed.out

# Keep the processed tex file for reference
echo "The processed LaTeX file is available at temp/resume_processed.tex"
