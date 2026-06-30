import { Link } from 'react-router-dom'
import { getProgress, getLevelTitle, getDailyXP, getWeeklyXP, checkAchievements } from '../utils/progress'
import { useState, useEffect } from 'react'

export default function Home() {
  const [progress, setProgress] = useState(getProgress())
  const [newAchievements, setNewAchievements] = useState([])

  useEffect(() => {
    const achievements = checkAchievements()
    if (achievements.length > 0) {
      setNewAchievements(achievements)
      setTimeout(() => setNewAchievements([]), 5000)
    }
    setProgress(getProgress())
  }, [])

  const levelInfo = getLevelTitle(progress.level)
  const dailyXP = getDailyXP()
  const weeklyXP = getWeeklyXP()
  const xpProgress = ((progress.xp % 100) / 100) * 100

  const quickActions = [
    { to: '/lessons', icon: '📚', label: 'Pelajaran', desc: `${progress.completedLessons.length} selesai` },
    { to: '/audio', icon: '🎧', label: 'Audio', desc: 'Dengar & Ucap' },
    { to: '/dictionary', icon: '📖', label: 'Kamus', desc: `${progress.wordsLearned.length} kata` },
    { to: '/writing', icon: '✍️', label: 'Menulis', desc: `${progress.writingPractice}x latihan` },
    { to: '/hsk', icon: '📝', label: 'Soal HSK', desc: 'HSK 1-6' },
    { to: '/chat', icon: '🤖', label: 'AI Tutor', desc: 'Tanya jawab' },
    { to: '/placement', icon: '🎯', label: 'Placement', desc: progress.placementTaken ? `HSK ${progress.placementLevel}` : 'Belum' },
    { to: '/profile', icon: '👤', label: 'Profil', desc: 'Statistik' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Achievement Notification */}
      {newAchievements.length > 0 && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-bounce-in max-w-2xl mx-auto">
          {newAchievements.map(a => (
            <div key={a.id} className="bg-yellow-400 text-yellow-900 px-5 py-4 rounded-2xl shadow-lg mb-2 flex items-center gap-3">
              <span className="text-3xl">{a.icon}</span>
              <div>
                <div className="font-bold text-sm">Achievement Unlocked!</div>
                <div className="text-xs">{a.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">MandarinMaster 🀄</h1>
            <p className="text-gray-500 text-sm">Selamat belajar!</p>
          </div>
          <Link to="/profile" className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-sm">
            <span className="text-xl">{levelInfo.emoji}</span>
            <div className="text-right">
              <div className="text-xs text-gray-500">Level {progress.level}</div>
              <div className="text-sm font-semibold">{levelInfo.title}</div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-500">{progress.streak}</div>
            <div className="text-xs text-gray-500 mt-1">🔥 Streak</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500">{dailyXP}</div>
            <div className="text-xs text-gray-500 mt-1">⭐ XP Hari Ini</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-500">{progress.xp}</div>
            <div className="text-xs text-gray-500 mt-1">💎 Total XP</div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress ke Level {progress.level + 1}</span>
            <span className="text-xs text-gray-500">{progress.xp % 100}/100 XP</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Mulai Belajar</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(action => (
            <Link
              key={action.to}
              to={action.to}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="font-semibold text-sm">{action.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Aktivitas Minggu Ini</h2>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-orange-500">{weeklyXP}</span>
            <span className="text-sm text-gray-500 ml-1">XP minggu ini</span>
          </div>
          <div className="flex justify-around">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date(Date.now() - (6 - i) * 86400000)
              const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()]
              const dateStr = date.toISOString().split('T')[0]
              const hasActivity = progress.dailyXP?.[dateStr] > 0
              const isToday = dateStr === new Date().toISOString().split('T')[0]
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium ${
                    isToday ? 'bg-red-500 text-white shadow-md' :
                    hasActivity ? 'bg-orange-200 text-orange-700' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {hasActivity ? '✓' : dayName.charAt(0)}
                  </div>
                  <span className="text-[10px] text-gray-500">{dayName}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
