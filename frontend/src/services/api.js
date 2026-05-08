import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

/* ── MOCK responses (used when backend is unavailable) ── */
const MOCK_RESULT = {
  score: 85,
  strengths: [
    'Strong technical skill set with modern technologies',
    'Clear and concise work experience descriptions',
    'Relevant certifications and education listed',
    'Good overall resume structure and flow',
  ],
  weaknesses: [
    'Summary section is too brief and lacks impact',
    'No quantifiable achievements or metrics included',
    'Missing links to portfolio or GitHub profile',
  ],
  missing_skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'GraphQL'],
  suggestions: [
    'Add specific metrics to your bullet points (e.g., "Increased performance by 40%").',
    'Include a direct link to your GitHub or portfolio in the header.',
    'Expand your professional summary to 3-4 impactful sentences.',
    'List any relevant certifications near the top of your resume.',
    'Tailor your skills section to match the job description keywords.',
  ],
  job_match_score: 72,
  summary_analysis:
    'Your resume demonstrates solid technical foundations and relevant work experience. However, the lack of quantifiable achievements and a compelling summary section may reduce your chances with ATS systems. Adding metrics and tailoring keywords to the target role will significantly boost your score.',
  improved_summary:
    'Experienced Full Stack Developer with 4+ years building scalable web applications using React, Node.js, and Python. Proven track record of delivering high-quality products in agile environments, reducing load times by 35% and increasing user engagement by 20%. Passionate about clean architecture and AI-integrated solutions.',
  improved_experience: [
    'Architected and deployed a React + FastAPI SaaS platform serving 5,000+ daily active users, achieving 99.9% uptime.',
    'Reduced API response times by 40% through query optimization and Redis caching strategies.',
    'Led a cross-functional team of 4 engineers to deliver project milestones 2 weeks ahead of schedule.',
  ],
}

const MOCK_IMPROVED = {
  improved_summary:
    'Results-driven Software Engineer with expertise in full-stack development, cloud infrastructure, and AI integration. Delivered 15+ production applications, consistently improving system performance and user satisfaction metrics by 25%+.',
  improved_experience: [
    'Spearheaded migration of legacy monolith to microservices architecture, reducing deployment time by 60%.',
    'Implemented automated testing pipelines that cut QA cycles by 50% and reduced production bugs by 35%.',
    'Collaborated with product and design teams to ship 3 major features that drove a 22% increase in retention.',
  ],
}

/* ─────────────────────────────────────────── */

/**
 * Analyze a CV file with optional job description
 * @param {File} file - PDF or DOCX file
 * @param {string} jobDescription - optional job description text
 * @returns {Promise<object>} structured analysis result
 */
export async function analyzeCV(file, jobDescription = '') {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (jobDescription.trim()) {
      formData.append('job_description', jobDescription)
    }

    const response = await api.post('/api/cv/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (err) {
    // If backend is not running, use mock data
    if (!err.response) {
      console.warn('[CVyntra] Backend unavailable – using mock response.')
      await delay(3000) // simulate processing time
      return MOCK_RESULT
    }
    const msg = err.response?.data?.detail || err.message || 'Analysis failed'
    throw new Error(msg)
  }
}

/**
 * Compare CV with job description for match scoring
 * @param {File} file
 * @param {string} jobDescription
 */
export async function jobMatch(file, jobDescription) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_description', jobDescription)
    const response = await api.post('/api/cv/job-match', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } catch (err) {
    if (!err.response) {
      await delay(2000)
      return { job_match_score: 72, missing_keywords: ['Docker', 'AWS'] }
    }
    throw new Error(err.response?.data?.detail || 'Job match failed')
  }
}

/**
 * Improve resume content via AI
 * @param {object} analysisResult - the existing analysis result
 */
export async function improveResume(analysisResult) {
  try {
    const response = await api.post('/api/cv/improve', analysisResult)
    return response.data
  } catch (err) {
    if (!err.response) {
      await delay(2500)
      return MOCK_IMPROVED
    }
    throw new Error(err.response?.data?.detail || 'Improvement failed')
  }
}

/* util */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
