"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
// import { toast } from 'sonner'

// Temporary toast replacement for demo (not used in this component)
// const toast = {
//   success: (message: string) => console.log('Success:', message),
//   error: (message: string) => console.log('Error:', message)
// }

// WHO Burnout Assessment Questions
const BURNOUT_QUESTIONS = [
  {
    id: 'exhaustion_1',
    category: 'Physical',
    question: 'I feel emotionally drained by my work',
    reverse: false
  },
  {
    id: 'exhaustion_2',
    category: 'Physical',
    question: 'I feel used up at the end of the workday',
    reverse: false
  },
  {
    id: 'exhaustion_3',
    category: 'Physical',
    question: 'I feel fatigued when I get up and have to face another day',
    reverse: false
  },
  {
    id: 'cynicism_1',
    category: 'Mental',
    question: 'I treat some recipients as if they were impersonal objects',
    reverse: false
  },
  {
    id: 'cynicism_2',
    category: 'Mental',
    question: 'I have become more callous toward people since I took this job',
    reverse: false
  },
  {
    id: 'cynicism_3',
    category: 'Mental',
    question: 'I worry that this job is hardening me emotionally',
    reverse: false
  },
  {
    id: 'efficacy_1',
    category: 'Emotional',
    question: 'I can easily understand how my recipients feel about things',
    reverse: true
  },
  {
    id: 'efficacy_2',
    category: 'Emotional',
    question: 'I deal very effectively with the problems of my recipients',
    reverse: true
  },
  {
    id: 'efficacy_3',
    category: 'Emotional',
    question: 'I feel I am positively influencing other people\'s lives through my work',
    reverse: true
  }
]

// Perceived Stress Scale Questions
const STRESS_QUESTIONS = [
  {
    id: 'stress_1',
    question: 'In the last month, how often have you been upset because of something that happened unexpectedly?'
  },
  {
    id: 'stress_2',
    question: 'In the last month, how often have you felt that you were unable to control the important things in your life?'
  },
  {
    id: 'stress_3',
    question: 'In the last month, how often have you felt nervous and "stressed"?'
  },
  {
    id: 'stress_4',
    question: 'In the last month, how often have you felt confident about your ability to handle your personal problems?'
  },
  {
    id: 'stress_5',
    question: 'In the last month, how often have you felt that things were going your way?'
  }
]

const RESPONSE_OPTIONS = [
  { value: '0', label: 'Never', score: 0 },
  { value: '1', label: 'Rarely', score: 1 },
  { value: '2', label: 'Sometimes', score: 2 },
  { value: '3', label: 'Often', score: 3 },
  { value: '4', label: 'Always', score: 4 }
]

export default function AssessmentPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState('intro') // intro, burnout, stress, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [burnoutAnswers, setBurnoutAnswers] = useState<Record<string, string>>({})
  const [stressAnswers, setStressAnswers] = useState<Record<string, string>>({})
  const [userMentor, setUserMentor] = useState<any>(null)

  useEffect(() => {
    // Get user mentor for personalized feedback
    const userData = JSON.parse(localStorage.getItem('rootedUser') || '{}')
    setUserMentor(userData.mentor)
  }, [])

  const calculateBurnoutScores = () => {
    const scores = { Physical: 0, Mental: 0, Emotional: 0 }
    
    BURNOUT_QUESTIONS.forEach(question => {
      const answer = burnoutAnswers[question.id]
      if (answer) {
        let score = parseInt(answer)
        if (question.reverse) {
          score = 4 - score // Reverse scoring for efficacy questions
        }
        scores[question.category as keyof typeof scores] += score
      }
    })

    // Normalize scores to percentage (each category has 3 questions, max score 12)
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.round((scores[key as keyof typeof scores] / 12) * 100)
    })

    return scores
  }

  const calculateStressScore = () => {
    let totalScore = 0
    STRESS_QUESTIONS.forEach(question => {
      const answer = stressAnswers[question.id]
      if (answer) {
        totalScore += parseInt(answer)
      }
    })
    return Math.round((totalScore / 20) * 100) // Normalize to percentage
  }

  const handleBurnoutAnswer = (questionId: string, value: string) => {
    setBurnoutAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleStressAnswer = (questionId: string, value: string) => {
    setStressAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentSection === 'burnout') {
      if (currentQuestionIndex < BURNOUT_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setCurrentSection('stress')
        setCurrentQuestionIndex(0)
      }
    } else if (currentSection === 'stress') {
      if (currentQuestionIndex < STRESS_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        // Calculate and save results
        const burnoutScores = calculateBurnoutScores()
        const stressScore = calculateStressScore()
        
        const results = {
          burnout: burnoutScores,
          stress: stressScore,
          completedAt: new Date().toISOString()
        }
        
        const userData = JSON.parse(localStorage.getItem('rootedUser') || '{}')
        const updatedUser = { ...userData, assessmentResults: results }
        localStorage.setItem('rootedUser', JSON.stringify(updatedUser))
        
        setCurrentSection('results')
      }
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else if (currentSection === 'stress') {
      setCurrentSection('burnout')
      setCurrentQuestionIndex(BURNOUT_QUESTIONS.length - 1)
    }
  }

  const getProgressPercentage = () => {
    if (currentSection === 'intro') return 0
    if (currentSection === 'burnout') {
      return (currentQuestionIndex / (BURNOUT_QUESTIONS.length + STRESS_QUESTIONS.length)) * 100
    }
    if (currentSection === 'stress') {
      return ((BURNOUT_QUESTIONS.length + currentQuestionIndex) / (BURNOUT_QUESTIONS.length + STRESS_QUESTIONS.length)) * 100
    }
    return 100
  }

  const canProceed = () => {
    if (currentSection === 'burnout') {
      return burnoutAnswers[BURNOUT_QUESTIONS[currentQuestionIndex].id]
    }
    if (currentSection === 'stress') {
      return stressAnswers[STRESS_QUESTIONS[currentQuestionIndex].id]
    }
    return false
  }

  const getBurnoutLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'bg-green-500', description: 'Minimal burnout indicators' }
    if (score < 60) return { level: 'Moderate', color: 'bg-yellow-500', description: 'Some burnout symptoms present' }
    return { level: 'High', color: 'bg-red-500', description: 'Significant burnout indicators' }
  }

  const getStressLevel = (score: number) => {
    if (score < 40) return { level: 'Low', color: 'bg-green-500', description: 'Good stress management' }
    if (score < 70) return { level: 'Moderate', color: 'bg-yellow-500', description: 'Manageable stress levels' }
    return { level: 'High', color: 'bg-red-500', description: 'High stress levels' }
  }

  const getMentorFeedback = (burnoutScores: any, stressScore: number) => {
    if (!userMentor) return "You're on a journey of self-discovery. Every step counts!"
    
    const avgBurnout = (burnoutScores.Physical + burnoutScores.Mental + burnoutScores.Emotional) / 3
    
    if (avgBurnout < 30 && stressScore < 40) {
      return `${userMentor.emoji} Great work! You're managing stress well. Let's build on these healthy patterns together! 🌟`
    } else if (avgBurnout < 60 && stressScore < 70) {
      return `${userMentor.emoji} I see some areas where we can work together. You're not alone in this journey - let's create some positive changes! 💪`
    } else {
      return `${userMentor.emoji} I'm here to support you through this challenging time. Remember, seeking help shows strength, not weakness. Let's take this one day at a time. 🤗`
    }
  }

  if (currentSection === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-4">
        <div className="container max-w-2xl mx-auto pt-20">
          <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                📊
              </div>
              <CardTitle className="text-2xl mb-2">Burnout & Stress Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                This scientifically-validated assessment will help us understand your current stress levels and burnout indicators.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">What to Expect:</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">WHO</Badge>
                    <span className="text-sm">World Health Organization Burnout Index</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">PSS</Badge>
                    <span className="text-sm">Perceived Stress Scale</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">5-10 min</Badge>
                    <span className="text-sm">Quick and comprehensive evaluation</span>
                  </div>
                </div>
              </div>

              <div className="text-gray-600 dark:text-gray-400 text-sm">
                <p>Your responses are private and will be used only to personalize your wellness journey.</p>
              </div>

              <Button 
                onClick={() => setCurrentSection('burnout')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold"
              >
                Begin Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentSection === 'results') {
    const burnoutScores = calculateBurnoutScores()
    const stressScore = calculateStressScore()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 p-4">
        <div className="container max-w-4xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Wellness Snapshot</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Here's what your assessment reveals about your current state
            </p>
          </div>

          {/* Mentor Feedback */}
          <Card className="mb-8 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {userMentor && (
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${userMentor.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {userMentor.emoji}
                  </div>
                )}
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg relative">
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-50 dark:bg-gray-700 rotate-45"></div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {getMentorFeedback(burnoutScores, stressScore)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Burnout Scores */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Burnout Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(burnoutScores).map(([category, score]) => {
                  const level = getBurnoutLevel(score)
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{category}</span>
                        <Badge variant="secondary">{score}%</Badge>
                      </div>
                      <Progress value={score} className="h-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {level.level}: {level.description}
                      </p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Stress Score */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Stress Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">{stressScore}%</div>
                  <Badge className={`${getStressLevel(stressScore).color} text-white`}>
                    {getStressLevel(stressScore).level} Stress
                  </Badge>
                </div>
                <Progress value={stressScore} className="h-3" />
                <p className="text-center text-gray-600 dark:text-gray-400">
                  {getStressLevel(stressScore).description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Based on your results, we've personalized your wellness toolkit to address your specific needs.
              </p>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold"
              >
                Explore Your Personalized Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Question Display
  const currentQuestion = currentSection === 'burnout' 
    ? BURNOUT_QUESTIONS[currentQuestionIndex]
    : STRESS_QUESTIONS[currentQuestionIndex]
  
  const currentAnswer = currentSection === 'burnout'
    ? burnoutAnswers[currentQuestion.id]
    : stressAnswers[currentQuestion.id]
    
  const questionCategory = currentSection === 'burnout' 
    ? (currentQuestion as any).category 
    : 'Stress'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-4">
      <div className="container max-w-2xl mx-auto pt-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{currentSection === 'burnout' ? 'Burnout Assessment' : 'Stress Assessment'}</span>
            <span>{currentQuestionIndex + 1} of {currentSection === 'burnout' ? BURNOUT_QUESTIONS.length : STRESS_QUESTIONS.length}</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {questionCategory}
              </Badge>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
              {currentQuestion.question}
            </h2>

            <RadioGroup 
              value={currentAnswer || ''} 
              onValueChange={(value) => {
                if (currentSection === 'burnout') {
                  handleBurnoutAnswer(currentQuestion.id, value)
                } else {
                  handleStressAnswer(currentQuestion.id, value)
                }
              }}
              className="space-y-3"
            >
              {RESPONSE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0 && currentSection === 'burnout'}
              >
                Previous
              </Button>
              <Button 
                onClick={nextQuestion}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {(currentSection === 'stress' && currentQuestionIndex === STRESS_QUESTIONS.length - 1) ? 'Complete Assessment' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}