"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
// import { toast } from 'sonner'

// Temporary toast replacement for demo
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.log('Error:', message)
}

const AVATAR_OPTIONS = {
  skinTones: [
    { name: 'Light', value: '#F3D5B7', emoji: '🏻' },
    { name: 'Medium Light', value: '#E8B887', emoji: '🏼' },
    { name: 'Medium', value: '#C89664', emoji: '🏽' },
    { name: 'Medium Dark', value: '#A67C5A', emoji: '🏾' },
    { name: 'Dark', value: '#8B5A3C', emoji: '🏿' }
  ],
  hairStyles: [
    { name: 'Short', emoji: '👨‍🦲' },
    { name: 'Wavy', emoji: '👨‍🦱' },
    { name: 'Curly', emoji: '👨‍🦱' },
    { name: 'Long', emoji: '👨‍🦰' },
    { name: 'Bald', emoji: '👨‍🦲' }
  ],
  outfitStyles: [
    { name: 'Professional', emoji: '👔', desc: 'Business attire' },
    { name: 'Casual', emoji: '👕', desc: 'Everyday comfort' },
    { name: 'Traditional', emoji: '🥻', desc: 'Indian ethnic wear' },
    { name: 'Creative', emoji: '🎨', desc: 'Artistic expression' }
  ],
  accessories: [
    { name: 'Glasses', emoji: '👓' },
    { name: 'Watch', emoji: '⌚' },
    { name: 'Earrings', emoji: '👂' },
    { name: 'None', emoji: '✨' }
  ]
}

export default function AvatarCreationPage() {
  const router = useRouter()
  const [avatarConfig, setAvatarConfig] = useState({
    name: '',
    skinTone: AVATAR_OPTIONS.skinTones[2].value,
    hairStyle: AVATAR_OPTIONS.hairStyles[0].name,
    outfitStyle: AVATAR_OPTIONS.outfitStyles[0].name,
    accessory: AVATAR_OPTIONS.accessories[3].name
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveAvatar = async () => {
    if (!avatarConfig.name.trim()) {
      toast.error('Please enter your name')
      return
    }

    setIsLoading(true)
    try {
      // Simulate avatar processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Get existing user data
      const existingUser = JSON.parse(localStorage.getItem('rootedUser') || '{}')
      
      // Save avatar configuration
      const updatedUser = {
        ...existingUser,
        avatar: avatarConfig,
        onboardingStep: 'avatar-complete'
      }
      
      localStorage.setItem('rootedUser', JSON.stringify(updatedUser))
      toast.success('Avatar created successfully!')
      router.push('/onboarding/mentor')
    } catch (error) {
      toast.error('Failed to save avatar. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedSkinTone = AVATAR_OPTIONS.skinTones.find(t => t.value === avatarConfig.skinTone)
  const selectedOutfit = AVATAR_OPTIONS.outfitStyles.find(o => o.name === avatarConfig.outfitStyle)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 p-4">
      <div className="container max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Your Avatar</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Design your digital self for your wellness journey
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Avatar Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {/* Avatar Display */}
              <div className="w-64 h-64 mx-auto mb-6 relative">
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center text-8xl shadow-lg border-4 border-white"
                  style={{ backgroundColor: avatarConfig.skinTone }}
                >
                  {selectedOutfit?.emoji}
                </div>
                {/* Name Badge */}
                {avatarConfig.name && (
                  <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm">
                    {avatarConfig.name}
                  </Badge>
                )}
              </div>
              
              {/* Avatar Summary */}
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p>Skin: {selectedSkinTone?.name}</p>
                <p>Hair: {avatarConfig.hairStyle}</p>
                <p>Style: {selectedOutfit?.desc}</p>
                <p>Accessory: {avatarConfig.accessory}</p>
              </div>
            </CardContent>
          </Card>

          {/* Customization Panel */}
          <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Customize Your Look</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Input */}
              <div>
                <Label htmlFor="avatarName" className="text-base font-semibold">What should we call you?</Label>
                <Input
                  id="avatarName"
                  value={avatarConfig.name}
                  onChange={(e) => setAvatarConfig({...avatarConfig, name: e.target.value})}
                  placeholder="Enter your preferred name"
                  className="mt-2"
                />
              </div>

              {/* Skin Tone */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Choose Your Skin Tone</Label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_OPTIONS.skinTones.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setAvatarConfig({...avatarConfig, skinTone: tone.value})}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        avatarConfig.skinTone === tone.value 
                          ? 'border-purple-500 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: tone.value }}
                      title={tone.name}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Hair Style</Label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.hairStyles.map((hair) => (
                    <button
                      key={hair.name}
                      onClick={() => setAvatarConfig({...avatarConfig, hairStyle: hair.name})}
                      className={`p-3 rounded-lg border transition-all text-2xl ${
                        avatarConfig.hairStyle === hair.name
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={hair.name}
                    >
                      {hair.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit Style */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Outfit Style</Label>
                <div className="grid grid-cols-2 gap-3">
                  {AVATAR_OPTIONS.outfitStyles.map((outfit) => (
                    <button
                      key={outfit.name}
                      onClick={() => setAvatarConfig({...avatarConfig, outfitStyle: outfit.name})}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        avatarConfig.outfitStyle === outfit.name
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{outfit.emoji}</span>
                        <div>
                          <div className="font-semibold">{outfit.name}</div>
                          <div className="text-sm text-gray-500">{outfit.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Accessories</Label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_OPTIONS.accessories.map((accessory) => (
                    <button
                      key={accessory.name}
                      onClick={() => setAvatarConfig({...avatarConfig, accessory: accessory.name})}
                      className={`p-3 rounded-lg border transition-all text-xl ${
                        avatarConfig.accessory === accessory.name
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={accessory.name}
                    >
                      {accessory.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleSaveAvatar}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Avatar...' : 'Continue to Mentor Selection'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mt-8">
          <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Account</span>
            <div className="w-8 h-0.5 bg-green-500"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Avatar</span>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
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