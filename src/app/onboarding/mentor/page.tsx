"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { toast } from 'sonner'

// Temporary toast replacement for demo
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.log('Error:', message)
}

const MENTOR_ANIMALS = [
  {
    id: 'owl',
    name: 'Wise Owl',
    emoji: '🦉',
    personality: 'Wise & Analytical',
    description: 'Deep thinker who provides thoughtful insights and helps you analyze patterns in your stress and behavior.',
    traits: ['Strategic thinking', 'Pattern recognition', 'Mindful reflection', 'Long-term planning'],
    greetings: [
      'Hoot! Let\'s take a moment to reflect on your day.',
      'Wisdom comes from understanding patterns. What are you noticing?',
      'Your mind is like a vast library - let\'s organize those thoughts.'
    ],
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'dolphin',
    name: 'Playful Dolphin',
    emoji: '🐬',
    personality: 'Joyful & Social',
    description: 'Energetic companion who brings lightness and social connection to your wellness journey.',
    traits: ['Emotional intelligence', 'Social connection', 'Playfulness', 'Stress relief'],
    greetings: [
      'Splash! Ready to dive into some joy today?',
      'Life\'s waves are easier to ride together - how can I support you?',
      'Let\'s make some positive waves in your day!'
    ],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'dog',
    name: 'Loyal Dog',
    emoji: '🐕',
    personality: 'Supportive & Encouraging',
    description: 'Your faithful companion who offers unconditional support and celebrates every small victory.',
    traits: ['Loyalty', 'Encouragement', 'Consistency', 'Emotional support'],
    greetings: [
      'Woof! I\'m here for you, always. How are you feeling?',
      'Every step forward is worth celebrating - you\'re doing great!',
      'Your loyal friend is here. What do you need today?'
    ],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'elephant',
    name: 'Gentle Elephant',
    emoji: '🐘',
    personality: 'Calm & Grounding',
    description: 'Steady presence who helps you stay grounded and provides strength during challenging times.',
    traits: ['Inner strength', 'Grounding', 'Stability', 'Memory & reflection'],
    greetings: [
      'Take a deep breath. I\'m here to help you find your center.',
      'Strength comes from within. Let\'s build yours together.',
      'Like ancient trees, we find peace in staying rooted.'
    ],
    color: 'from-gray-500 to-slate-600'
  },
  {
    id: 'butterfly',
    name: 'Transforming Butterfly',
    emoji: '🦋',
    personality: 'Inspiring & Transformative',
    description: 'Guide for personal transformation who helps you embrace change and discover your potential.',
    traits: ['Transformation', 'Growth mindset', 'Creativity', 'Adaptation'],
    greetings: [
      'Beautiful changes await you. Let\'s explore them together.',
      'Every day is a chance to spread your wings a little wider.',
      'Transformation is natural - you\'re exactly where you need to be.'
    ],
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'turtle',
    name: 'Patient Turtle',
    emoji: '🐢',
    personality: 'Patient & Mindful',
    description: 'Teaches the art of slow living and helps you find peace in patience and mindful presence.',
    traits: ['Patience', 'Mindfulness', 'Slow living', 'Sustainable habits'],
    greetings: [
      'Slow and steady wins the race. What small step can we take today?',
      'There\'s wisdom in moving at your own pace.',
      'Let\'s practice being present in this moment.'
    ],
    color: 'from-teal-500 to-green-600'
  }
]

export default function MentorSelectionPage() {
  const router = useRouter()
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
  const [previewMessage, setPreviewMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleMentorSelect = (mentorId: string) => {
    setSelectedMentor(mentorId)
    const mentor = MENTOR_ANIMALS.find(m => m.id === mentorId)
    if (mentor) {
      const randomGreeting = mentor.greetings[Math.floor(Math.random() * mentor.greetings.length)]
      setPreviewMessage(randomGreeting)
    }
  }

  const handleConfirmMentor = async () => {
    if (!selectedMentor) {
      toast.error('Please select a mentor animal')
      return
    }

    setIsLoading(true)
    try {
      // Simulate mentor assignment
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Get existing user data
      const existingUser = JSON.parse(localStorage.getItem('rootedUser') || '{}')
      const mentorData = MENTOR_ANIMALS.find(m => m.id === selectedMentor)
      
      // Save mentor selection
      const updatedUser = {
        ...existingUser,
        mentor: mentorData,
        onboardingStep: 'mentor-complete'
      }
      
      localStorage.setItem('rootedUser', JSON.stringify(updatedUser))
      toast.success('Mentor assigned successfully!')
      router.push('/assessment')
    } catch (error) {
      toast.error('Failed to assign mentor. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedMentorData = MENTOR_ANIMALS.find(m => m.id === selectedMentor)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 p-4">
      <div className="container max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Mentor</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
            Select an animal guide who will support you throughout your wellness journey. 
            Each mentor offers unique wisdom and personality traits.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mentor Options */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {MENTOR_ANIMALS.map((mentor) => (
                <Card 
                  key={mentor.id}
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    selectedMentor === mentor.id
                      ? 'border-blue-500 shadow-xl scale-105 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white/90 dark:bg-gray-800/90'
                  } backdrop-blur-sm`}
                  onClick={() => handleMentorSelect(mentor.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${mentor.color} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                      {mentor.emoji}
                    </div>
                    <CardTitle className="text-xl">{mentor.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto">
                      {mentor.personality}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-4 leading-relaxed">
                      {mentor.description}
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Traits:</div>
                      <div className="flex flex-wrap gap-1">
                        {mentor.traits.map((trait, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Mentor Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMentorData ? (
                  <div className="text-center">
                    {/* Selected Mentor Display */}
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${selectedMentorData.color} flex items-center justify-center text-6xl mb-6 shadow-lg`}>
                      {selectedMentorData.emoji}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{selectedMentorData.name}</h3>
                    <Badge className="mb-4">{selectedMentorData.personality}</Badge>
                    
                    {/* Preview Message */}
                    {previewMessage && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 relative">
                        <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-50 dark:bg-gray-700 rotate-45"></div>
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          "{previewMessage}"
                        </p>
                      </div>
                    )}
                    
                    {/* Mentor Details */}
                    <div className="text-left space-y-3 mb-6">
                      <div>
                        <strong className="text-sm text-gray-600 dark:text-gray-400">Personality:</strong>
                        <p className="text-sm">{selectedMentorData.personality}</p>
                      </div>
                      <div>
                        <strong className="text-sm text-gray-600 dark:text-gray-400">Specializes In:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMentorData.traits.slice(0, 2).map((trait, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <Button 
                      onClick={handleConfirmMentor}
                      className={`w-full bg-gradient-to-r ${selectedMentorData.color} hover:opacity-90 text-white py-3 text-lg font-semibold`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Assigning Mentor...' : `Choose ${selectedMentorData.name}`}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                    <div className="text-4xl mb-4">🤔</div>
                    <p>Click on a mentor to see their preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mt-12">
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Account</span>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Avatar</span>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Mentor</span>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>Assessment</span>
          </div>
        </div>
      </div>
    </div>
  )
}