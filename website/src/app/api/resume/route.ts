import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Function to replace template variables
function populateTemplate(template: string, data: any): string {
  // Replace simple variables
  let result = template;
  for (const key in data) {
    if (typeof data[key] === 'string') {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, data[key]);
    }
  }

  // Handle arrays with Mustache-like syntax
  // For education section
  if (data.education && Array.isArray(data.education)) {
    let educationContent = '';
    data.education.forEach((edu: any) => {
      let eduTemplate = '\\cventry{{{years}}}{{{degree}}}{{{institution}}}{{{location}}}{}{{{description}}}\n';
      for (const key in edu) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        eduTemplate = eduTemplate.replace(regex, edu[key]);
      }
      educationContent += eduTemplate;
    });
    result = result.replace(/{{#education}}([\s\S]*?){{\/education}}/g, educationContent);
  }

  // For experience section
  if (data.experience && Array.isArray(data.experience)) {
    let experienceContent = '';
    data.experience.forEach((exp: any) => {
      let expTemplate = '\\cventry{{{years}}}{{{position}}}{{{company}}}{{{location}}}{}{\\begin{itemize}\n';
      for (const key in exp) {
        if (key !== 'responsibilities') {
          const regex = new RegExp(`{{${key}}}`, 'g');
          expTemplate = expTemplate.replace(regex, exp[key]);
        }
      }
      
      // Handle responsibilities
      if (exp.responsibilities && Array.isArray(exp.responsibilities)) {
        exp.responsibilities.forEach((resp: string) => {
          expTemplate += `\\item ${resp}\n`;
        });
      }
      
      expTemplate += '\\end{itemize}}\n';
      experienceContent += expTemplate;
    });
    result = result.replace(/{{#experience}}([\s\S]*?){{\/experience}}/g, experienceContent);
  }

  // Handle skills section
  if (data.skills) {
    for (const key in data.skills) {
      const regex = new RegExp(`{{skills.${key}}}`, 'g');
      result = result.replace(regex, data.skills[key]);
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  try {
    // Get the resume data
    const dataPath = path.join(process.cwd(), 'src/app/api/resume/data.json');
    const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));

    // Get the LaTeX template
    const templatePath = path.join(process.cwd(), 'src/app/api/resume/template.tex');
    const template = await fs.readFile(templatePath, 'utf8');

    // Populate the template with data
    const populatedTemplate = populateTemplate(template, data);

    // Create a temporary directory for LaTeX compilation
    const tempDir = path.join(process.cwd(), 'temp');
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }

    // Write the populated template to a temporary file
    const tempFilePath = path.join(tempDir, 'resume.tex');
    await fs.writeFile(tempFilePath, populatedTemplate);

    // Compile the LaTeX file to PDF using pdflatex
    // Note: This requires pdflatex to be installed on the server
    const outputPath = path.join(tempDir, 'resume.pdf');
    
    try {
      // Run pdflatex twice to ensure proper references
      await execPromise(`pdflatex -output-directory=${tempDir} ${tempFilePath}`);
      await execPromise(`pdflatex -output-directory=${tempDir} ${tempFilePath}`);
      
      // Read the generated PDF
      const pdfBuffer = await fs.readFile(outputPath);
      
      // Clean up temporary files
      const filesToDelete = ['resume.tex', 'resume.aux', 'resume.log', 'resume.out'];
      for (const file of filesToDelete) {
        try {
          await fs.unlink(path.join(tempDir, file));
        } catch (error) {
          console.error(`Error deleting ${file}:`, error);
        }
      }
      
      // Return the PDF
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="resume.pdf"'
        }
      });
    } catch (error) {
      console.error('Error compiling LaTeX:', error);
      return NextResponse.json({ error: 'Error compiling LaTeX' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json({ error: 'Error generating resume' }, { status: 500 });
  }
}
