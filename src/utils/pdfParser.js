import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

export const extractResumeFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  // First, try to get embedded JSON data from PDF metadata
  try {
    const metadata = await pdf.getMetadata();
    const subject = metadata?.info?.Subject;
    if (subject && subject.startsWith('{')) {
      const parsed = JSON.parse(subject);
      if (parsed && typeof parsed === 'object' && parsed.fullName !== undefined) {
        return parsed;
      }
    }
  } catch {
    // Fall through to text extraction
  }

  // Fall back to text extraction
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return parseResumeFromText(fullText);
};

export const parseResumeFromText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());

  const resumeData = {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    experience: [],
    education: [],
    skills: {},
    projects: []
  };

  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) {
    resumeData.linkedin = 'https://www.' + linkedinMatch[0];
  }

  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) {
    resumeData.github = 'https://' + githubMatch[0];
  }

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    resumeData.email = emailMatch[0];
  }

  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    resumeData.phone = phoneMatch[0];
  }

  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 50 && !firstLine.includes('@')) {
      resumeData.fullName = firstLine;
    }
  }

  const locationMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})/);
  if (locationMatch) {
    resumeData.location = locationMatch[0];
  }

  const titlePatterns = [
    /(?:Senior|Junior|Lead|Principal|Staff)?\s*(?:Software|Frontend|Backend|Full\s*Stack|DevOps|Data|ML|AI|Cloud|Systems|Network|Security|IT|Web|Mobile|iOS|Android)\s*(?:Engineer|Developer|Architect|Designer|Manager|Analyst|Scientist|Specialist|Consultant)/i,
    /(?:Project|Product|Scrum|Agile)\s*(?:Manager|Coordinator|Owner|Master)/i,
    /(?:CEO|CTO|CFO|COO|VP|Director|Head)\s*(?:of\s*\w+)?/i
  ];

  for (const pattern of titlePatterns) {
    const titleMatch = text.match(pattern);
    if (titleMatch) {
      resumeData.jobTitle = titleMatch[0];
      break;
    }
  }

  const skillsSection = text.match(/(?:Skills|Technical Skills|Core Competencies)[:\s]*([\s\S]*?)(?=\n\n|Experience|Education|Projects|$)/i);
  if (skillsSection) {
    const skillsText = skillsSection[1];
    const skillKeywords = skillsText.match(/[A-Z][a-z]+(?:\s*[&/,]\s*[A-Z][a-z]+)*/g) || [];

    const technicalSkills = [];
    const otherSkills = [];

    skillKeywords.forEach(skill => {
      if (/\b(Java|Python|JavaScript|TypeScript|React|Angular|Vue|Node|AWS|Azure|GCP|Docker|Kubernetes|SQL|MongoDB|Git|REST|API|HTML|CSS|Swift|Kotlin|C\+\+|Ruby|PHP|Linux|Windows|MySQL|PostgreSQL|Redis|Kafka|Terraform|Jenkins|CI\/CD|Agile|Scrum|Jira|Confluence|Figma|Photoshop|Illustrator)\b/i.test(skill)) {
        technicalSkills.push(skill.trim());
      } else {
        otherSkills.push(skill.trim());
      }
    });

    if (technicalSkills.length > 0) {
      resumeData.skills['Technical'] = [...new Set(technicalSkills)].slice(0, 10);
    }
    if (otherSkills.length > 0) {
      resumeData.skills['Other'] = [...new Set(otherSkills)].slice(0, 5);
    }
  }

  const experienceSection = text.match(/(?:Experience|Work Experience|Professional Experience|Employment)[:\s]*([\s\S]*?)(?=\n\n|Education|Skills|Projects|$)/i);
  if (experienceSection) {
    const expText = experienceSection[1];
    const companies = expText.match(/([A-Z][A-Za-z\s&.,]+(?:Inc|Corp|LLC|Ltd|Co|Company|Solutions|Technologies|Systems|Group|Partners))/g) || [];

    companies.forEach(company => {
      const companyIndex = expText.indexOf(company);
      const surroundingText = expText.substring(companyIndex, companyIndex + 500);

      const positionMatch = surroundingText.match(/(?:Senior|Junior|Lead|Principal|Staff)?\s*(?:Software|Frontend|Backend|Full\s*Stack|DevOps|Data|ML|AI|Cloud|Systems|Network|Security|IT|Web|Mobile|iOS|Android|Project|Product)\s*(?:Engineer|Developer|Architect|Designer|Manager|Analyst|Scientist|Specialist|Coordinator)/i);
      const dateMatch = surroundingText.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s*\d{4}\s*[-–—to]+\s*(?:Present|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s*\d{4}/i);

      if (resumeData.experience.length < 5) {
        resumeData.experience.push({
          company: company.trim(),
          position: positionMatch ? positionMatch[0] : 'Position',
          location: '',
          startDate: dateMatch ? dateMatch[0].split(/[-–—to]+/)[0].trim() : '',
          endDate: dateMatch ? dateMatch[0].split(/[-–—to]+/)[1]?.trim() || 'Present' : 'Present',
          description: ''
        });
      }
    });
  }

  const educationSection = text.match(/(?:Education|Academic Background)[:\s]*([\s\S]*?)(?=\n\n|Experience|Skills|Projects|$)/i);
  if (educationSection) {
    const eduText = educationSection[1];
    const degrees = eduText.match(/(?:Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|MBA|B\.E\.|M\.E\.|B\.Tech|M\.Tech)\w*(?:\s*(?:of|in)\s*[A-Z][\w\s]*)?/gi) || [];
    const universities = eduText.match(/(?:University|College|Institute|School)\s+of\s+[A-Z][\w\s]+/gi) || [];

    degrees.forEach((degree, index) => {
      if (resumeData.education.length < 3) {
        resumeData.education.push({
          school: universities[index] || 'University',
          degree: degree.trim(),
          startDate: '',
          endDate: ''
        });
      }
    });
  }

  const summaryMatch = text.match(/(?:Summary|Profile|About|Objective)[:\s]*([\s\S]*?)(?=\n\n|Experience|Education|Skills|$)/i);
  if (summaryMatch) {
    resumeData.summary = summaryMatch[1].trim().substring(0, 300);
  } else if (lines.length > 3) {
    const potentialSummary = lines.slice(1, 4).join(' ').substring(0, 300);
    if (potentialSummary.length > 50) {
      resumeData.summary = potentialSummary;
    }
  }

  return resumeData;
};
