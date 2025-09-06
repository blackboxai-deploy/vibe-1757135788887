"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function OnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store user data
      localStorage.setItem('rootedUser', JSON.stringify({
        email: formData.email,
        name: formData.name,
        registeredAt: new Date().toISOString()
      }))
      
      toast.success('Account created successfully!')
      router.push('/onboarding/avatar')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // Simulate SSO flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock user data for demo
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

  const handleWorkplaceLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate workplace SSO
      await new Promise(resolve => setTimeout(resolve, 1800))
      
      const mockUser = {
        email: 'employee@company.com',
        name: 'Employee User',
        registeredAt: new Date().toISOString(),
        provider: 'workplace',
        organizationId: 'demo-org-123'
      }
      
      localStorage.setItem('rootedUser', JSON.stringify(mockUser))
      toast.success('Workplace login successful')
      router.push('/onboarding/avatar')
    } catch (error) {
      toast.error('Workplace login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 p-4">
      <div className="container max-w-md mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
            R
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Rooted</h1>
          <p className="text-gray-600 dark:text-gray-300">Let's begin your wellness journey</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred way to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Registration Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
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
                  placeholder="Create a password"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="mt-1"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

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

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500">enterprise</span>
              </div>
            </div>

            {/* Workplace Login */}
            <Button 
              variant="outline" 
              className="w-full border-blue-200 hover:bg-blue-50"
              onClick={handleWorkplaceLogin}
              disabled={isLoading}
            >
              <span className="mr-2">🏢</span>
              Workplace Login
            </Button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <button 
                  onClick={() => router.push('/login')}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}