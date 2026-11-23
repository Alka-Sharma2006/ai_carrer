const { GoogleGenAI } = require('@google/genai')

function createClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    const error = new Error('GEMINI_API_KEY is not configured')
    error.status = 503
    throw error
  }

  // Vertex AI sirf tab chalega jab .env me GEMINI_PROVIDER=vertex likha ho.
  const useVertex = process.env.GEMINI_PROVIDER === 'vertex'

  return new GoogleGenAI({ apiKey, vertexai: useVertex })
}

async function generateText(prompt) {
  const ai = createClient()
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt,
  })
  return response.text
}

module.exports = { generateText }