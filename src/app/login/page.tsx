"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
// import { toast } from 'sonner'

// Temporary toast replacement for demo
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.log('Error:', message)
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if user exists in localStorage (for demo purposes)
      const existingUser = localStorage.getItem('rootedUser')
      
      if (existingUser) {
        const userData = JSON.parse(existingUser)
        // Check if user has completed onboarding
        if (userData.mentor && userData.avatar) {
          toast.success('Welcome back!')
          router.push('/dashboard')
        } else {
          toast.success('Login successful! Let\'s complete your setup.')
          router.push('/onboarding/avatar')
        }
      } else {
        // Demo: Create a mock logged-in user
        const mockUser = {
          email: formData.email,
          name: formData.email.split('@')[0],
          registeredAt: new Date().toISOString()
        }
        localStorage.setItem('rootedUser', JSON.stringify(mockUser))
        toast.success('Login successful! Let\'s set up your profile.')
        router.push('/onboarding/avatar')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // Simulate SSO flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockUser = {
        email: `user@${provider}.com`,
        name: `${provider} User`,
        registeredAt: new Date().toISOString(),
        provider
      }
      
      localStorage.setItem('rootedUser', JSON.stringify(mockUser))
      toast.success(`Signed in with ${provider}`)
      router.push('/onboarding/avatar')
    } catch (error) {
      toast.error(`${provider} sign-in failed`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 p-4">
      <div className="container max-w-md mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
              R
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-300">Sign in to continue your wellness journey</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access your personalized wellness dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="mt-1"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <button className="text-sm text-green-600 hover:text-green-700">
                Forgot your password?
              </button>
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500">or</span>
              </div>
            </div>

            {/* SSO Options */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSSOLogin('Google')}
                disabled={isLoading}
              >
                <span className="mr-2">🔍</span>
                Continue with Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSSOLogin('Microsoft')}
                disabled={isLoading}
              >
                <span className="mr-2">📘</span>
                Continue with Microsoft
              </Button>
            </div>

            {/* Demo Account */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Demo Account</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                Try the app with these credentials:
              </p>
              <div className="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded">
                <div>Email: demo@rooted.app</div>
                <div>Password: demo123</div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link 
                  href="/onboarding"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Features */}
        <Card className="mt-6 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-center">What awaits you:</h3>
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div className="p-2">
                <div className="text-xl mb-1">🧘‍♀️</div>
                <div className="font-medium">Daily Practices</div>
              </div>
              <div className="p-2">
                <div className="text-xl mb-1">📊</div>
                <div className="font-medium">Progress Tracking</div>
              </div>
              <div className="p-2">
                <div className="text-xl mb-1">🦉</div>
                <div className="font-medium">AI Mentor</div>
              </div>
              <div className="p-2">
                <div className="text-xl mb-1">👥</div>
                <div className="font-medium">Community</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}