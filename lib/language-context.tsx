"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Language = 'fr' | 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Enhanced translations object with more comprehensive coverage
const translations = {
  fr: {
    // Login page
    'login.title': 'Connexion',
    'login.description': 'Accédez à votre espace de recherche UH2C',
    'login.username': 'Nom d\'utilisateur',
    'login.username.placeholder': 'Entrez votre nom d\'utilisateur',
    'login.password': 'Mot de passe',
    'login.password.placeholder': 'Entrez votre mot de passe',
    'login.remember': 'Se souvenir de moi',
    'login.forgot': 'Mot de passe oublié?',
    'login.submit': 'Se connecter',
    'login.help': 'Besoin d\'aide?',
    'login.support': 'Contactez le support',
    'login.error': 'Erreur de connexion',
    'login.success': 'Connexion réussie',
    
    // Hero section
    'hero.title': 'Plateforme de Recherche UH2C',
    'hero.description': 'Gérez vos projets de recherche, publications et collaborations scientifiques',
    'hero.subtitle': 'Excellence académique et innovation',
    
    // Language selector
    'language.selector': 'Langue',
    'language.fr': 'Français',
    'language.en': 'Anglais',
    'language.ar': 'Arabe',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.download': 'Télécharger',
    'common.upload': 'Téléverser',
    'common.confirm': 'Confirmer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.ok': 'OK',
  },
  en: {
    // Login page
    'login.title': 'Login',
    'login.description': 'Access your UH2C research space',
    'login.username': 'Username',
    'login.username.placeholder': 'Enter your username',
    'login.password': 'Password',
    'login.password.placeholder': 'Enter your password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.submit': 'Sign in',
    'login.help': 'Need help?',
    'login.support': 'Contact support',
    'login.error': 'Login error',
    'login.success': 'Login successful',
    
    // Hero section
    'hero.title': 'UH2C Research Platform',
    'hero.description': 'Manage your research projects, publications and scientific collaborations',
    'hero.subtitle': 'Academic excellence and innovation',
    
    // Language selector
    'language.selector': 'Language',
    'language.fr': 'French',
    'language.en': 'English',
    'language.ar': 'Arabic',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
  },
  ar: {
    // Login page
    'login.title': 'تسجيل الدخول',
    'login.description': 'الوصول إلى مساحة البحث الخاصة بك في جامعة الحسن الثاني',
    'login.username': 'اسم المستخدم',
    'login.username.placeholder': 'أدخل اسم المستخدم الخاص بك',
    'login.password': 'كلمة المرور',
    'login.password.placeholder': 'أدخل كلمة المرور الخاصة بك',
    'login.remember': 'تذكرني',
    'login.forgot': 'نسيت كلمة المرور؟',
    'login.submit': 'تسجيل الدخول',
    'login.help': 'تحتاج مساعدة؟',
    'login.support': 'اتصل بالدعم',
    'login.error': 'خطأ في تسجيل الدخول',
    'login.success': 'تم تسجيل الدخول بنجاح',
    
    // Hero section
    'hero.title': 'منصة البحث بجامعة الحسن الثاني',
    'hero.description': 'إدارة مشاريع البحث والمنشورات والتعاون العلمي',
    'hero.subtitle': 'التميز الأكاديمي والابتكار',
    
    // Language selector
    'language.selector': 'اللغة',
    'language.fr': 'الفرنسية',
    'language.en': 'الإنجليزية',
    'language.ar': 'العربية',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.download': 'تحميل',
    'common.upload': 'رفع',
    'common.confirm': 'تأكيد',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'موافق',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr')

  const dir = language === 'ar' ? 'rtl' : 'ltr'

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  // Update HTML lang and dir attributes when language changes
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
    
    // Add language-specific font classes
    document.documentElement.classList.remove('font-arabic', 'font-latin')
    if (language === 'ar') {
      document.documentElement.classList.add('font-arabic')
    } else {
      document.documentElement.classList.add('font-latin')
    }
  }, [language, dir])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
