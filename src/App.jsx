import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Dictionary from './pages/Dictionary'
import Writing from './pages/Writing'
import HSKTest from './pages/HSKTest'
import AIChat from './pages/AIChat'
import PlacementTest from './pages/PlacementTest'
import Profile from './pages/Profile'
import AudioExercise from './pages/AudioExercise'
import { getProgress } from './utils/progress'

function NavBar() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '🏠', label: 'Beranda' },
    { path: '/lessons', icon: '📚', label: 'Pelajaran' },
    { path: '/audio', icon: '🎧', label: 'Audio' },
    { path: '/dictionary', icon: '📖', label: 'Kamus' },
    { path: '/writing', icon: '✍️', label: 'Menulis' },
    { path: '/hsk', icon: '📝', label: 'HSK' },
    { path: '/chat', icon: '🤖', label: 'AI Tutor' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-2xl mx-auto flex justify-around items-center py-1.5 px-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-all ${
              location.pathname === item.path
                ? 'text-red-500 scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] mt-0.5 font-medium leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(onFinish, 300)
          return 100
        }
        return p + 4
      })
    }, 50)
    return () => clearInterval(interval)
  }, [onFinish])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-400 to-yellow-400 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Character */}
        <div className="relative mb-6">
          <div className="w-28 h-28 mx-auto relative">
            {/* Cute character body */}
            <div className="absolute inset-0 bg-white rounded-full shadow-lg flex items-center justify-center float">
              <div className="text-center">
                <div className="text-4xl mb-0.5">你好</div>
                <div className="flex gap-1 justify-center">
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
                <div className="w-4 h-1.5 border-b-2 border-gray-800 rounded-full mx-auto mt-0.5"></div>
              </div>
            </div>
            {/* Sparkles */}
            <div className="absolute -top-2 -right-2 text-xl animate-pulse">✨</div>
            <div className="absolute -bottom-1 -left-3 text-sm animate-pulse" style={{animationDelay: '0.5s'}}>⭐</div>
            <div className="absolute top-0 -left-4 text-xs animate-pulse" style={{animationDelay: '1s'}}>💫</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">MandarinMaster</h1>
        <p className="text-white/80 text-sm mb-8">Belajar Mandarin Jadi Mudah & Menyenangkan</p>

        {/* Progress Bar */}
        <div className="w-48 mx-auto">
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/60 text-xs mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

  return (
    <Router basename="/mandarin-master">
      <div className="min-h-screen bg-gray-50" style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lesson/:id" element={<LessonDetail />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/hsk" element={<HSKTest />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/audio" element={<AudioExercise />} />
          <Route path="/placement" element={<PlacementTest />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  )
}

export default App
