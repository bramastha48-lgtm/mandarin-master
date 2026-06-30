import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { lessons } from '../data/lessons'
import { completeLesson, addWordLearned } from '../utils/progress'
import { speak, speakSlow } from '../utils/tts'

export default function LessonDetail() {
  const { id } = useParams()
  const lesson = lessons.find(l => l.id === parseInt(id))
  const [activeTab, setActiveTab] = useState('vocab')
  const [showComplete, setShowComplete] = useState(false)
  const [playingWord, setPlayingWord] = useState(null)

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2">Pelajaran tidak ditemukan</h2>
        <Link to="/lessons" className="text-red-500">← Kembali ke Pelajaran</Link>
      </div>
    )
  }

  const tabs = [
    { id: 'vocab', label: 'Kosakata', icon: '📝' },
    { id: 'grammar', label: 'Grammar', icon: '📐' },
    { id: 'dialogue', label: 'Dialog', icon: '💬' },
    { id: 'culture', label: 'Budaya', icon: '🏮' },
  ]

  const handleComplete = () => {
    completeLesson(lesson.id)
    lesson.vocab.forEach(v => addWordLearned(v))
    setShowComplete(true)
  }

  const playWord = async (character) => {
    setPlayingWord(character)
    try {
      await speak(character)
    } catch (e) {
      console.error('TTS error:', e)
    }
    setTimeout(() => setPlayingWord(null), 500)
  }

  const playWordSlow = async (character) => {
    setPlayingWord(character)
    try {
      await speakSlow(character)
    } catch (e) {
      console.error('TTS error:', e)
    }
    setTimeout(() => setPlayingWord(null), 500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/lessons" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-lg">
          ←
        </Link>
        <div>
          <h1 className="text-xl font-bold">{lesson.icon} {lesson.title}</h1>
          <p className="text-sm text-gray-500">{lesson.titleCn} · HSK {lesson.hsk}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        {activeTab === 'vocab' && (
          <div>
            <h3 className="font-bold mb-4 text-lg">Kosakata ({lesson.vocab.length} kata)</h3>
            <p className="text-xs text-gray-500 mb-4">💡 Klik kata untuk mendengar pengucapannya</p>
            <div className="space-y-3">
              {lesson.vocab.map((word, i) => (
                <div
                  key={i}
                  onClick={() => playWord(word.character)}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all active:scale-98 ${
                    playingWord === word.character ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-xl font-bold text-red-600 flex-shrink-0">
                    {word.character.length > 2 ? word.character.charAt(0) : word.character}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xl">{word.character}</div>
                    <div className="text-sm text-gray-500">{word.pinyin}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium">{word.meaning}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); playWordSlow(word.character) }}
                      className="text-xs text-blue-500 mt-1"
                    >
                      🐢 Pelan
                    </button>
                  </div>
                  <div className="text-gray-300 flex-shrink-0">
                    {playingWord === word.character ? '🔊' : '▶️'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'grammar' && (
          <div>
            <h3 className="font-bold mb-4 text-lg">Pola Grammar</h3>
            <div className="space-y-5">
              {lesson.grammar.map((g, i) => (
                <div key={i} className="p-5 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                  <div className="font-bold text-blue-800 mb-2">{g.title}</div>
                  <div
                    className="font-mono text-lg mb-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-50 transition-all"
                    onClick={() => {
                      // Extract Chinese characters from pattern for TTS
                      const chinese = g.pattern.match(/[\u4e00-\u9fff]+/g)
                      if (chinese) speak(chinese.join(''))
                    }}
                  >
                    {g.pattern} <span className="text-blue-400 text-sm ml-2">🔊</span>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">{g.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dialogue' && (
          <div>
            <h3 className="font-bold mb-4 text-lg">Dialog</h3>
            <p className="text-xs text-gray-500 mb-4">💡 Klik pesan untuk mendengar</p>
            <div className="space-y-4">
              {lesson.dialogue.map((line, i) => (
                <div key={i} className={`flex ${line.speaker === 'A' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    onClick={() => speak(line.text)}
                    className={`max-w-[85%] p-4 rounded-2xl cursor-pointer transition-all active:scale-95 ${
                      line.speaker === 'A'
                        ? 'bg-gray-100 rounded-bl-sm hover:bg-gray-200'
                        : 'bg-red-500 text-white rounded-br-sm hover:bg-red-600'
                    }`}
                  >
                    <div className="text-xs font-bold mb-1 opacity-60">
                      {line.speaker === 'A' ? '👤 A' : '👤 B'} <span className="ml-1">🔊</span>
                    </div>
                    <div className="font-medium text-base">{line.text}</div>
                    <div className={`text-xs mt-2 ${line.speaker === 'A' ? 'text-gray-500' : 'text-white/70'}`}>
                      {line.translation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'culture' && (
          <div>
            <h3 className="font-bold mb-4 text-lg">🏮 Catatan Budaya</h3>
            <div className="p-5 bg-orange-50 rounded-xl border-l-4 border-orange-400">
              <p className="text-sm leading-relaxed text-gray-700">{lesson.culture}</p>
            </div>
          </div>
        )}
      </div>

      {/* Complete Button */}
      <div className="mt-5">
        {showComplete ? (
          <div className="bg-green-500 text-white rounded-xl p-5 text-center animate-bounce-in">
            <div className="text-4xl mb-2">🎉</div>
            <div className="font-bold text-lg">Pelajaran Selesai!</div>
            <div className="text-sm opacity-80">+20 XP</div>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl p-5 font-bold text-lg hover:opacity-90 transition-all active:scale-95"
          >
            ✅ Tandai Selesai (+20 XP)
          </button>
        )}
      </div>
    </div>
  )
}
