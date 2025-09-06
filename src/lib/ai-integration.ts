// AI Integration for Rooted App
// Using OpenRouter and Replicate APIs via custom endpoint

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: string; text?: string; image_url?: { url: string }; file?: { filename: string; file_data: string } }>
}

export interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

// Custom endpoint configuration
const CUSTOM_ENDPOINT = 'https://oi-server.onrender.com/chat/completions'
const HEADERS = {
  'customerId': 'amruta92s@gmail.com',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
}

// Default models
const DEFAULT_CHAT_MODEL = 'openrouter/anthropic/claude-sonnet-4'
const DEFAULT_IMAGE_MODEL = 'replicate/black-forest-labs/flux-1.1-pro'
const DEFAULT_VIDEO_MODEL = 'replicate/google/veo-3'

/**
 * Generate AI chat response using custom endpoint
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  model: string = DEFAULT_CHAT_MODEL,
  systemPrompt?: string
): Promise<AIResponse> {
  try {
    const payload = {
      model,
      messages: systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages
    }

    const response = await fetch(CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data.choices?.[0]?.message?.content || data
    }
  } catch (error) {
    console.error('Chat AI Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Generate image using AI
 */
export async function generateImage(
  prompt: string,
  model: string = DEFAULT_IMAGE_MODEL
): Promise<AIResponse> {
  try {
    const payload = {
      model,
      messages: [{
        role: 'user',
        content: `Generate an image: ${prompt}`
      }]
    }

    const response = await fetch(CUSTOM_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data.choices?.[0]?.message?.content || data
    }
  } catch (error) {
    console.error('Image AI Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Generate personalized wellness recommendations based on user data
 */
export async function generatePersonalizedRecommendations(
  userData: any,
  assessmentResults: any,
  currentMood?: string
): Promise<AIResponse> {
  const systemPrompt = `You are a compassionate AI wellness coach specializing in workplace burnout recovery. 
You provide personalized, culturally-aware recommendations for Indian professionals. 
Focus on practical, evidence-based interventions that can be done in 5-10 minutes during work hours.
Always be supportive, understanding, and provide specific actionable advice.`

  const userContext = `
User Profile:
- Name: ${userData.avatar?.name || 'User'}
- Mentor Animal: ${userData.mentor?.name || 'None'}
- Burnout Scores: Physical ${assessmentResults?.burnout?.Physical || 0}%, Mental ${assessmentResults?.burnout?.Mental || 0}%, Emotional ${assessmentResults?.burnout?.Emotional || 0}%
- Stress Level: ${assessmentResults?.stress || 0}%
- Current Mood: ${currentMood || 'Not specified'}

Please provide 3 specific, personalized recommendations for today based on this data.
Focus on Indian workplace culture and include practical tips they can implement immediately.
Keep recommendations brief and actionable.`

  return await generateChatResponse([
    { role: 'user', content: userContext }
  ], DEFAULT_CHAT_MODEL, systemPrompt)
}

/**
 * Generate mentor dialogue based on user's current state
 */
export async function generateMentorDialogue(
  mentorPersonality: any,
  userState: any,
  context: string = 'daily_checkin'
): Promise<AIResponse> {
  const systemPrompt = `You are ${mentorPersonality.name}, a ${mentorPersonality.personality} animal mentor.
Your role is to provide supportive, encouraging dialogue in the character's voice.
Personality traits: ${mentorPersonality.traits?.join(', ') || 'supportive, wise'}
Keep responses under 100 words, use the character's emoji, and maintain their unique voice.
Be culturally sensitive to Indian workplace contexts.`

  const userContext = `
Context: ${context}
User's current state: ${JSON.stringify(userState, null, 2)}

Provide a supportive message as ${mentorPersonality.name} would say it.
Use ${mentorPersonality.emoji} and speak in character.`

  return await generateChatResponse([
    { role: 'user', content: userContext }
  ], DEFAULT_CHAT_MODEL, systemPrompt)
}

/**
 * Analyze user's stress patterns and provide insights
 */
export async function analyzeStressPatterns(
  dailyLogs: any[],
  assessmentHistory: any[]
): Promise<AIResponse> {
  const systemPrompt = `You are an expert in workplace stress analysis and burnout recovery.
Analyze the provided data to identify patterns, triggers, and provide actionable insights.
Focus on practical recommendations for Indian professionals dealing with workplace stress.
Be encouraging and provide hope while being realistic about challenges.`

  const analysisData = `
Daily Mood/Energy Logs (last 30 days):
${JSON.stringify(dailyLogs.slice(-30), null, 2)}

Assessment History:
${JSON.stringify(assessmentHistory, null, 2)}

Please provide:
1. Key stress patterns identified
2. Potential triggers or risk factors
3. Positive trends or improvements
4. 3 specific recommendations for the upcoming week
Keep the analysis encouraging and actionable.`

  return await generateChatResponse([
    { role: 'user', content: analysisData }
  ], DEFAULT_CHAT_MODEL, systemPrompt)
}

/**
 * Generate custom meditation script based on user needs
 */
export async function generateMeditationScript(
  meditationType: string,
  duration: number,
  userNeeds: string[]
): Promise<AIResponse> {
  const systemPrompt = `You are an expert meditation teacher creating personalized guided meditation scripts.
Create a ${duration}-minute ${meditationType} meditation specifically addressing: ${userNeeds.join(', ')}.
Format as a complete script with timing cues, gentle guidance, and soothing language.
Include culturally relevant elements for Indian practitioners when appropriate.`

  const requestContent = `
Create a ${duration}-minute guided ${meditationType} meditation script.
Focus areas: ${userNeeds.join(', ')}
Include proper timing, breathing cues, and gentle transitions.
Make it suitable for workplace stress relief.`

  return await generateChatResponse([
    { role: 'user', content: requestContent }
  ], DEFAULT_CHAT_MODEL, systemPrompt)
}

/**
 * Process user's journal entry and provide reflective insights
 */
export async function processJournalEntry(
  journalText: string,
  userData: any
): Promise<AIResponse> {
  const systemPrompt = `You are a compassionate AI companion helping with self-reflection and emotional processing.
Read the user's journal entry and provide gentle, supportive insights.
Help them identify emotions, patterns, and potential positive actions.
Be encouraging and non-judgmental, offering hope and practical suggestions when appropriate.
Keep responses warm, personal, and under 150 words.`

  const content = `
User's journal entry: "${journalText}"
User context: ${userData.mentor?.name || 'No mentor'} is their guide.

Provide supportive reflection and gentle insights to help them process their thoughts and feelings.`

  return await generateChatResponse([
    { role: 'user', content: content }
  ], DEFAULT_CHAT_MODEL, systemPrompt)
}

/**
 * Convert file to base64 for multimodal AI processing
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * Timeout wrapper for AI requests
 */
export function withTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number = 60000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ])
}