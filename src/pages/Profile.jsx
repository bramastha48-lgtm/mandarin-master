import { useState } from 'react'
import { getProgress, getLevelTitle, resetProgress, checkAchievements } from '../utils/progress'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(getProgress())
  const [showReset, setShowReset] = useState(false)
  const levelInfo = getLevelTitle(progress.level)

  const achievements = [
    { id: 'first_lesson', name: 'Langkah Pertama', icon: '🎯', desc: 'Selesaikan pelajaran pertama', check: () => progress.completedLessons.length >= 1 },
    { id: 'five_lessons', name: 'Pembelajar Rajin', icon: '📚', desc: 'Selesaikan 5 pelajaran', check: () => progress.completedLessons.length >= 5 },
    { id: 'ten_lessons', name: 'Master Pelajaran', icon: '🏆', desc: 'Selesaikan 10 pelajaran', check: () => progress.completedLessons.length >= 10 },
    { id: 'first_hsk', name: 'HSK Warrior', icon: '⚔️', desc: 'Ambil tes HSK pertama', check: () => Object.keys(progress.hskScores).length >= 1 },
    { id: 'all_hsk', name: 'HSK Legend', icon: '👑', desc: 'Ambil semua tes HSK', check: () => Object.keys(progress.hskScores).length >= 6 },
    { id: 'word_10', name: 'Kolektor Kata', icon: '📝', desc: 'Pelajari 10 kata', check: () => progress.wordsLearned.length >= 10 },
    { id: 'word_50', name: 'Kamus Berjalan', icon: '📖', desc: 'Pelajari 50 kata', check: () => progress.wordsLearned.length >= 50 },
    { id: 'word_100', name: 'Master Kosakata', icon: '🎓', desc: 'Pelajari 100 kata', check: () => progress.wordsLearned.length >= 100 },
    { id: 'streak_3', name: 'Konsisten 3 Hari', icon: '🔥', desc: 'Streak 3 hari berturut', check: () => progress.streak >= 3 },
    { id: 'streak_7', name: 'Seminggu Berturut', icon: '💪', desc: 'Streak 7 hari berturut', check: () => progress.streak >= 7 },
    { id: 'streak_30', name: 'Sebulan Penuh', icon: '🌟', desc: 'Streak 30 hari berturut', check: () => progress.streak >= 30 },
    { id: 'writer_10', name: 'Penulis Pemula', icon: '✏️', desc: 'Latihan menulis 10x', check: () => progress.writingPractice >= 10 },
    { id: 'writer_50', name: 'Master Kaligrafi', icon: '🖊️', desc: 'Latihan menulis 50x', check: () => progress.writingPractice >= 50 },
    { id: 'chat_10', name: 'Pembicara Ramah', icon: '💬', desc: 'Kirim 10 pesan ke AI', check: () => progress.chatMessages >= 10 },
    { id: 'chat_50', name: 'AI Chat Master', icon: '🤖', desc: 'Kirim 50 pesan ke AI', check: () => progress.chatMessages >= 50 },
    { id: 'xp_100', name: '100 XP!', icon: '⭐', desc: 'Kumpulkan 100 XP', check: () => progress.xp >= 100 },
    { id: 'xp_500', name: '500 XP!', icon: '🌠', desc: 'Kumpulkan 500 XP', check: () => progress.xp >= 500 },
    { id: 'xp_1000', name: '1000 XP!', icon: '💫', desc: 'Kumpulkan 1000 XP', check: () => progress.xp >= 1000 },
  ]

  const handleReset = () => {
    resetProgress()
    setProgress(getProgress())
    setShowReset(false)
  }

  const unlockedCount = achievements.filter(a => progress.achievements.includes(a.id)).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            {levelInfo.emoji}
          </div>
          <div>
            <div className="text-2xl font-bold">Level {progress.level}</div>
            <div className="text-white/80">{levelInfo.title}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{progress.xp}</div>
            <div className="text-xs text-white/70">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{progress.streak}</div>
            <div className="text-xs text-white/70">🔥 Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{progress.completedLessons.length}</div>
            <div className="text-xs text-white/70">📚 Pelajaran</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{progress.wordsLearned.length}</div>
            <div className="text-xs text-white/70">📝 Kata</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xl mb-1">✍️</div>
          <div className="text-lg font-bold">{progress.writingPractice}</div>
          <div className="text-xs text-gray-500">Latihan Menulis</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xl mb-1">💬</div>
          <div className="text-lg font-bold">{progress.chatMessages}</div>
          <div className="text-xs text-gray-500">Chat dengan AI</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xl mb-1">📝</div>
          <div className="text-lg font-bold">{Object.keys(progress.hskScores).length}/6</div>
          <div className="text-xs text-gray-500">Tes HSK</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-xl mb-1">🏆</div>
          <div className="text-lg font-bold">{unlockedCount}/{achievements.length}</div>
          <div className="text-xs text-gray-500">Achievements</div>
        </div>
      </div>

      {/* HSK Scores */}
      {Object.keys(progress.hskScores).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">📊 Skor HSK</h2>
          <div className="space-y-2">
            {Object.entries(progress.hskScores).map(([level, data]) => (
              <div key={level} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold">HSK {level}</span>
                    <span className="text-sm text-gray-500 ml-2">{data.score}/{data.total}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                    data.percentage >= 80 ? 'bg-green-500' :
                    data.percentage >= 60 ? 'bg-blue-500' :
                    data.percentage >= 40 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}>
                    {data.percentage}%
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.percentage >= 80 ? 'bg-green-500' :
                      data.percentage >= 60 ? 'bg-blue-500' :
                      data.percentage >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">🏆 Achievements</h2>
        <div className="space-y-2">
          {achievements.map(achievement => {
            const unlocked = progress.achievements.includes(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 ${
                  unlocked ? '' : 'opacity-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-gray-500">{achievement.desc}</div>
                </div>
                {unlocked && (
                  <span className="text-green-500 text-sm">✅</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Placement Test */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/placement')}
          className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <div className="text-left">
              <div className="font-medium text-sm">Placement Test</div>
              <div className="text-xs text-gray-500">
                {progress.placementTaken ? `Level: HSK ${progress.placementLevel}` : 'Belum diambil'}
              </div>
            </div>
          </div>
          <span className="text-gray-400">→</span>
        </button>
      </div>

      {/* Reset */}
      <div className="mb-6">
        {showReset ? (
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="font-bold text-sm text-red-600 mb-2">⚠️ Reset Semua Progress?</div>
            <p className="text-xs text-gray-600 mb-3">Semua data (XP, pelajaran, skor HSK, achievements) akan dihapus permanen.</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium"
              >
                Ya, Reset
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 bg-gray-100 rounded-lg py-2 text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowReset(true)}
            className="w-full bg-white rounded-xl p-3 shadow-sm text-sm text-red-500 flex items-center justify-center gap-2"
          >
            🗑️ Reset Progress
          </button>
        )}
      </div>
    </div>
  )
}
