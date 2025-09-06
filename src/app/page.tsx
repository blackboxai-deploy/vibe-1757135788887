"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const features = [
    {
      title: "Personal Avatar",
      description: "Create your unique digital self with customizable appearance and colors",
      icon: "🧑‍💼"
    },
    {
      title: "Animal Mentor",
      description: "Choose your wisdom guide - owl, dolphin, or dog - for personalized support",
      icon: "🦉"
    },
    {
      title: "Burnout Assessment",
      description: "WHO-validated burnout index with personalized stress evaluation",
      icon: "📊"
    },
    {
      title: "Micro-Interventions",
      description: "5-10 minute guided tools: breathwork, meditation, yoga, journaling",
      icon: "🧘‍♀️"
    },
    {
      title: "Wellness Breaks",
      description: "Animal therapy clips and mindful games for instant stress relief",
      icon: "🎮"
    },
    {
      title: "Nutrition Guidance",
      description: "Gut-mind connection tips with mood-based Indian food suggestions",
      icon: "🥗"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* App Logo/Brand */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              R
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mt-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Rooted
              </span>
            </h1>
          </div>

          {/* Hero Content */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              Reclaim Your Workplace Well-being
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered mental wellness companion designed specifically for Indian professionals. 
              Transform workplace burnout into renewed energy with your personal animal mentor.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg">
                  Start Your Wellness Journey
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap gap-3 justify-center mb-16">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              ✨ WHO-Validated Assessment
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              🎯 Indian Culture Focused
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              ⚡ 5-Minute Daily Practices
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              🤖 AI-Powered Insights
            </Badge>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Complete Wellness Toolkit
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Evidence-based interventions wrapped in engaging, culturally-aware experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Work Life?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of Indian professionals who have found balance, reduced stress, 
            and renewed their passion for work.
          </p>
          <Link href="/onboarding">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Begin Your Journey Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics/Social Proof */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5 min</div>
              <div className="text-gray-600 dark:text-gray-400">Daily Practice</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">WHO</div>
              <div className="text-gray-600 dark:text-gray-400">Validated Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">AI Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">🇮🇳</div>
              <div className="text-gray-600 dark:text-gray-400">Culture Aware</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}