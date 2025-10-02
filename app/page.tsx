"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ username: false, password: false })
  const { t, language, dir } = useLanguage()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation des champs vides
    const newErrors = {
      username: !username.trim(),
      password: !password.trim()
    }
    
    setErrors(newErrors)
    
    // Si il y a des erreurs, ne pas continuer
    if (newErrors.username || newErrors.password) {
      return
    }
    
    // Handle login logic here
    console.log("Login attempt:", { username, password })
  }

  // Réinitialiser les erreurs quand l'utilisateur commence à taper
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: false }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: false }))
    }
  }

  return (
    <div className="min-h-screen flex" dir={dir} lang={language}>
      {/* Left side - Login Form */}
      <div className={`flex-1 flex items-center justify-center p-8 bg-white ${language === 'ar' ? 'order-2' : 'order-1'}`}>
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Image
              src="https://nibras.univh2c.ma/nibras_stsm/uh2c_logo_oth.jpg"
              alt="UH2C Logo"
              width={200}
              height={80}
              className="mx-auto rounded-lg"
            />
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 text-center card-header">
              <div className="w-full text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 card-title">{t('login.title')}</CardTitle>
              </div>
              <div className="w-full text-center">
                <CardDescription className="text-gray-600 card-description">{t('login.description')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className={`text-sm font-medium text-gray-700 ${language === 'ar' ? 'text-right block w-full' : ''}`}>
                    {t('login.username')}
                  </Label>
                  <div className="relative">
                    <User className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="username"
                      type="text"
                      placeholder={t('login.username.placeholder')}
                      value={username}
                      onChange={handleUsernameChange}
                      className={`h-12 ${language === 'ar' ? 'pr-12' : 'pl-10'} ${
                        errors.username 
                          ? '!border-2 !border-red-500 !outline-none !ring-0' 
                          : 'border border-gray-300 focus:border-uh2c-blue focus:ring-uh2c-blue'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={`text-sm font-medium text-gray-700 ${language === 'ar' ? 'text-right block w-full' : ''}`}>
                    {t('login.password')}
                  </Label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('login.password.placeholder')}
                      value={password}
                      onChange={handlePasswordChange}
                      className={`h-12 ${language === 'ar' ? 'pr-12 pl-12' : 'pl-10 pr-10'} ${
                        errors.password 
                          ? '!border-2 !border-red-500 !outline-none !ring-0' 
                          : 'border border-gray-300 focus:border-uh2c-blue focus:ring-uh2c-blue'
                      }`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`absolute top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${language === 'ar' ? 'left-1' : 'right-2'}`}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-uh2c-blue focus:ring-uh2c-blue border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className={`block text-sm text-gray-700 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>
                      {t('login.remember')}
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-uh2c-blue hover:text-uh2c-blue/80">
                      {t('login.forgot')}
                    </a>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white font-medium">
                  {t('login.submit')}
                </Button>

                {/* Language Selector - Positioned under login button */}
                <div className="flex justify-center pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t('language.selector')}:</span>
                    <LanguageSelector />
                  </div>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('login.help')}{" "}
                  <a href="#" className="font-medium text-uh2c-blue hover:text-uh2c-blue/80">
                    {t('login.support')}
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className={`hidden lg:block lg:flex-1 relative ${language === 'ar' ? 'order-1' : 'order-2'}`}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://tt0uih3hjztijmjb.public.blob.vercel-storage.com/alexsys/uh2c/recherche-img.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-4">{t('hero.title')}</h1>
              <p className="text-xl opacity-90">
                {t('hero.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
