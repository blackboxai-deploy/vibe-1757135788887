"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('rootedUser') || '{}')
    setUserData(user)

    // Update time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    const name = userData?.avatar?.name || 'Friend'
    
    if (hour < 12) return `Good morning, ${name}! 🌅`
    if (hour < 17) return `Good afternoon, ${name}! ☀️`
    return `Good evening, ${name}! 🌙`
  }

  const getMentorMessage = () => {
    if (!userData?.mentor) return null
    
    const messages = [
      "Ready to nurture your well-being today?",
      "What would help you feel more balanced right now?",
      "Remember, small steps lead to big changes!",
      "I'm here to support your wellness journey.",
      "How can we make today a little brighter?"
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    return randomMessage
  }

  const getBurnoutSummary = () => {
    if (!userData?.assessmentResults?.burnout) return null
    
    const { Physical, Mental, Emotional } = userData.assessmentResults.burnout
    const average = Math.round((Physical + Mental + Emotional) / 3)
    
    if (average < 30) return { level: 'Good', color: 'bg-green-500', message: 'You\'re managing well!' }
    if (average < 60) return { level: 'Moderate', color: 'bg-yellow-500', message: 'Some areas need attention' }
    return { level: 'High', color: 'bg-red-500', message: 'Let\'s focus on recovery' }
  }

  const quickActions = [
    {
      title: 'Quick Breathwork',
      description: '2-minute breathing exercise',
      icon: '🫁',
      href: '/interventions/breathwork',
      time: '2 min',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Mini Meditation',
      description: 'Guided mindfulness session',
      icon: '🧘‍♀️',
      href: '/interventions/meditation',
      time: '5 min',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Desk Yoga',
      description: 'Gentle stretches for work',
      icon: '🤸‍♀️',
      href: '/interventions/yoga',
      time: '7 min',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Journal',
      description: 'Reflect on your thoughts',
      icon: '📝',
      href: '/interventions/journaling',
      time: '5 min',
      color: 'from-orange-500 to-red-600'
    }
  ]

  const wellnessBreaks = [
    {
      title: 'Animal Therapy',
      description: 'Cute animal videos',
      icon: '🐶',
      href: '/breaks/animal-therapy',
      time: '1 min'
    },
    {
      title: 'Mindful Games',
      description: 'Calming puzzle games',
      icon: '🎮',
      href: '/breaks/games',
      time: '3 min'
    }
  ]

  const todaysRecommendations = [
    {
      title: 'Hydration Reminder',
      description: 'You haven\'t logged water intake today',
      action: 'Track Water',
      priority: 'low'
    },
    {
      title: 'Posture Check',
      description: 'Time for a posture break',
      action: 'Stretch Now',
      priority: 'medium'
    },
    {
      title: 'Stress Level',
      description: 'Your stress seems elevated. Try breathing exercises.',
      action: 'Start Breathing',
      priority: 'high'
    }
  ]

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getWelcomeMessage()}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{currentTime}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Avatar Display */}
              {userData.avatar && (
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: userData.avatar.skinTone }}
                  >
                    👤
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {userData.avatar.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mentor Message */}
            {userData.mentor && (
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${userData.mentor.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {userData.mentor.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg relative">
                        <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-50 dark:bg-gray-700 rotate-45"></div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {getMentorMessage()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Quick Interventions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-xl`}>
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{action.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{action.description}</div>
                              <Badge variant="secondary" className="mt-1 text-xs">{action.time}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wellness Breaks */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>☕</span>
                  <span>Wellness Breaks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {wellnessBreaks.map((breakItem, index) => (
                    <Link key={index} href={breakItem.href}>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-0">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{breakItem.icon}</div>
                          <div className="font-semibold">{breakItem.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{breakItem.description}</div>
                          <Badge variant="outline" className="mt-2 text-xs">{breakItem.time}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Burnout Summary */}
            {getBurnoutSummary() && (
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Wellness Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${getBurnoutSummary()?.color} flex items-center justify-center text-white text-lg font-bold mb-2`}>
                      📊
                    </div>
                    <Badge variant="secondary">{getBurnoutSummary()?.level}</Badge>
                  </div>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
                    {getBurnoutSummary()?.message}
                  </p>
                  <Link href="/assessment">
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Daily Recommendations */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Today's Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysRecommendations.map((rec, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-500' :
                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-semibold text-sm">{rec.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 ml-4">
                      {rec.description}
                    </p>
                    <Button variant="outline" size="sm" className="ml-4 text-xs">
                      {rec.action}
                    </Button>
                    {index < todaysRecommendations.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Explore More</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/nutrition">
                  <Button variant="ghost" className="w-full justify-start">
                    🥗 Nutrition Guide
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="ghost" className="w-full justify-start">
                    👥 Community
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="ghost" className="w-full justify-start">
                    📈 Progress Tracking
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" className="w-full justify-start">
                    ⚙️ Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="grid grid-cols-4 py-2">
          <Link href="/dashboard" className="flex flex-col items-center py-2 text-green-600">
            <span className="text-lg">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/interventions" className="flex flex-col items-center py-2 text-gray-600">
            <span className="text-lg">🧘‍♀️</span>
            <span className="text-xs">Practice</span>
          </Link>
          <Link href="/breaks" className="flex flex-col items-center py-2 text-gray-600">
            <span className="text-lg">☕</span>
            <span className="text-xs">Breaks</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 text-gray-600">
            <span className="text-lg">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}