"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const BREATH_TECHNIQUES = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal counts for inhale, hold, exhale, hold',
    duration: 4,
    pattern: [4, 4, 4, 4],
    labels: ['Inhale', 'Hold', 'Exhale', 'Hold'],
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
    icon: '📦',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'calming',
    name: 'Calming Breath',
    description: 'Longer exhale for relaxation',
    duration: 3,
    pattern: [4, 0, 8, 0],
    labels: ['Inhale', '', 'Exhale', ''],
    benefits: ['Deep relaxation', 'Anxiety relief', 'Better sleep'],
    icon: '🌙',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'energy',
    name: 'Energizing Breath',
    description: 'Quick energizing technique',
    duration: 2,
    pattern: [2, 0, 2, 0],
    labels: ['Inhale', '', 'Exhale', ''],
    benefits: ['Increases alertness', 'Boosts energy', 'Mental clarity'],
    icon: '⚡',
    color: 'from-orange-500 to-red-600'
  }
]

export default function BreathworkPage() {
  const router = useRouter()
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0)
  const [totalCycles, setTotalCycles] = useState(0)
  const [completedCycles, setCompletedCycles] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const technique = BREATH_TECHNIQUES.find(t => t.id === selectedTechnique)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startBreathing = (cycles: number = 5) => {
    if (!technique) return
    
    setTotalCycles(cycles)
    setCompletedCycles(0)
    setCurrentPhase(0)
    setPhaseTimeLeft(technique.pattern[0])
    setIsActive(true)

    intervalRef.current = setInterval(() => {
      setPhaseTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentPhase(currentPhase => {
            const nextPhase = (currentPhase + 1) % 4
            
            // Check if we completed a full cycle
            if (nextPhase === 0) {
              setCompletedCycles(completed => {
                const newCompleted = completed + 1
                if (newCompleted >= cycles) {
                  // Session complete
                  setIsActive(false)
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                  }
                  return newCompleted
                }
                return newCompleted
              })
            }
            
            return nextPhase
          })
          
          return technique.pattern[currentPhase === 3 ? 0 : currentPhase + 1]
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopBreathing = () => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleComplete = () => {
    // Save session data
    const sessionData = {
      technique: technique?.name,
      duration: technique?.duration,
      cycles: completedCycles,
      completedAt: new Date().toISOString()
    }
    
    // Store in localStorage (in real app, would sync to backend)
    const existingData = JSON.parse(localStorage.getItem('breathworkSessions') || '[]')
    existingData.push(sessionData)
    localStorage.setItem('breathworkSessions', JSON.stringify(existingData))
    
    router.push('/dashboard')
  }

  const getCurrentPhaseLabel = () => {
    if (!technique) return ''
    const label = technique.labels[currentPhase]
    return label || 'Rest'
  }

  const getBreathingCircleScale = () => {
    if (!technique) return 1
    const progress = (technique.pattern[currentPhase] - phaseTimeLeft) / technique.pattern[currentPhase]
    
    if (currentPhase === 0) { // Inhale
      return 1 + (progress * 0.5)
    } else if (currentPhase === 2) { // Exhale
      return 1.5 - (progress * 0.5)
    }
    return currentPhase === 1 ? 1.5 : 1 // Hold phases
  }

  if (!selectedTechnique) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 p-4">
        <div className="container max-w-4xl mx-auto pt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="absolute top-4 left-4"
            >
              ← Back
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Breathwork</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Choose a breathing technique to calm your mind and body
            </p>
          </div>

          {/* Technique Selection */}
          <div className="grid md:grid-cols-3 gap-6">
            {BREATH_TECHNIQUES.map((tech) => (
              <Card 
                key={tech.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                onClick={() => setSelectedTechnique(tech.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${tech.color} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                    {tech.icon}
                  </div>
                  <CardTitle className="text-xl">{tech.name}</CardTitle>
                  <Badge variant="secondary">{tech.duration} min session</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{tech.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <div className="space-y-1">
                      {tech.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs block w-fit mx-auto">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-sm font-semibold mb-1">Pattern:</div>
                    <div className="flex justify-center space-x-2 text-xs">
                      {tech.labels.map((label, index) => (
                        label && (
                          <span key={index} className="flex flex-col items-center">
                            <span>{label}</span>
                            <span className="font-mono">{tech.pattern[index]}s</span>
                          </span>
                        )
                      ))}
                    </div>
                  </div>

                  <Button className={`w-full bg-gradient-to-r ${tech.color} hover:opacity-90 text-white`}>
                    Start {tech.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="mt-8 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">How Breathwork Helps</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl mb-2">🧠</div>
                    <h4 className="font-semibold mb-1">Mental Clarity</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Increases focus and reduces mental fog
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">❤️</div>
                    <h4 className="font-semibold mb-1">Stress Relief</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Activates the relaxation response
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">⚡</div>
                    <h4 className="font-semibold mb-1">Energy Balance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Regulates your nervous system
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (completedCycles >= totalCycles && !isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You completed {completedCycles} cycles of {technique?.name}. Great work!
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">How do you feel now?</h3>
              <div className="flex justify-center space-x-2">
                {['😌', '😊', '😄', '🤩'].map((emoji, index) => (
                  <button key={index} className="text-2xl p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => setSelectedTechnique(null)}
                variant="outline" 
                className="w-full"
              >
                Try Another Technique
              </Button>
              <Button 
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 p-4">
      <div className="container max-w-2xl mx-auto pt-8">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedTechnique(null)}
          className="absolute top-4 left-4"
        >
          ← Back
        </Button>

        {/* Session Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${technique?.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
            {technique?.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {technique?.name}
          </h1>
          <Badge variant="secondary">
            Cycle {completedCycles + 1} of {totalCycles}
          </Badge>
        </div>

        {/* Breathing Circle */}
        <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div 
                className="w-64 h-64 mx-auto rounded-full border-4 border-blue-500 flex items-center justify-center transition-transform duration-1000 ease-in-out"
                style={{ 
                  transform: `scale(${getBreathingCircleScale()})`,
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)'
                }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {phaseTimeLeft}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {getCurrentPhaseLabel()}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase Indicators */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {technique?.labels.map((label, index) => (
                label && (
                  <div 
                    key={index}
                    className={`text-center p-2 rounded ${
                      currentPhase === index 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs">{technique.pattern[index]}s</div>
                  </div>
                )
              ))}
            </div>

            <Separator className="mb-6" />

            {/* Controls */}
            <div className="text-center space-y-4">
              {!isActive ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Session Length</label>
                    <div className="flex justify-center space-x-2">
                      {[3, 5, 10].map(cycles => (
                        <Button
                          key={cycles}
                          variant="outline"
                          size="sm"
                          onClick={() => startBreathing(cycles)}
                        >
                          {cycles} cycles
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={stopBreathing}
                  variant="outline"
                  className="w-full"
                >
                  Stop Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technique Info */}
        <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">About This Technique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              {technique?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {technique?.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="p-2">
                  {benefit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}