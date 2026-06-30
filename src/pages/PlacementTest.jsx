import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProgress, saveProgress } from '../utils/progress'

const placementQuestions = [
  { q: "Arti dari 你好 adalah...", options: ["Terima kasih", "Halo", "Selamat tinggal", "Maaf"], answer: 1, level: 1 },
  { q: "Arti dari 谢谢 adalah...", options: ["Halo", "Maaf", "Terima kasih", "Ya"], answer: 2, level: 1 },
  { q: "Pinyin yang benar untuk 大 adalah...", options: ["dā", "dá", "dǎ", "dà"], answer: 3, level: 1 },
  { q: "Arti dari 学校 adalah...", options: ["Rumah sakit", "Sekolah", "Bank", "Restoran"], answer: 1, level: 1 },
  { q: "Arti dari 朋友 adalah...", options: ["Keluarga", "Teman", "Tetangga", "Guru"], answer: 1, level: 2 },
  { q: "Arti dari 买 adalah...", options: ["Menjual", "Membeli", "Membawa", "Memberi"], answer: 1, level: 2 },
  { q: "Arti dari 贵 adalah...", options: ["Murah", "Mahal", "Bagus", "Buruk"], answer: 1, level: 2 },
  { q: "Arti dari 手机 adalah...", options: ["Komputer", "Telepon rumah", "Handphone", "Televisi"], answer: 2, level: 2 },
  { q: "Kata penghubung 'meskipun' dalam bahasa Mandarin adalah...", options: ["因为", "所以", "虽然", "如果"], answer: 2, level: 3 },
  { q: "Arti dari 经济 adalah...", options: ["Politik", "Ekonomi", "Budaya", "Sejarah"], answer: 1, level: 3 },
  { q: "Arti dari 环境 adalah...", options: ["Masyarakat", "Lingkungan", "Pemerintah", "Negara"], answer: 1, level: 3 },
  { q: "Arti dari 电脑 adalah...", options: ["Handphone", "Komputer", "Televisi", "Radio"], answer: 1, level: 3 },
  { q: "Arti dari 关系 adalah...", options: ["Masalah", "Hubungan", "Perbedaan", "Kesamaan"], answer: 1, level: 4 },
  { q: "Arti dari 经验 adalah...", options: ["Pengetahuan", "Pengalaman", "Keterampilan", "Pendidikan"], answer: 1, level: 4 },
  { q: "Arti dari 认为 adalah...", options: ["Mengetahui", "Berpendapat", "Merasa", "Mengingat"], answer: 1, level: 4 },
  { q: "Arti dari 解释 adalah...", options: ["Bertanya", "Menjelaskan", "Menjawab", "Mendengar"], answer: 1, level: 4 },
  { q: "Arti dari 挑战 adalah...", options: ["Peluang", "Tantangan", "Masalah", "Solusi"], answer: 1, level: 5 },
  { q: "Arti dari 坚持 adalah...", options: ["Menyerah", "Bertahan/Tekun", "Berhenti", "Mengubah"], answer: 1, level: 5 },
  { q: "Arti dari 莫名其妙 adalah...", options: ["Sangat jelas", "Tidak dapat dijelaskan", "Sangat mudah", "Sangat sulit"], answer: 1, level: 6 },
  { q: "Arti dari 一举两得 adalah...", options: ["Dua usaha satu hasil", "Satu usaha dua hasil", "Tidak ada hasil", "Banyak usaha"], answer: 1, level: 6 },
]

export default function PlacementTest() {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const startTest = () => {
    setStarted(true)
    setCurrentQ(0)
    setAnswers({})
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setAnswers({ ...answers, [currentQ]: index })
  }

  const nextQuestion = () => {
    if (currentQ < placementQuestions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelectedAnswer(null)
    } else {
      // Calculate level
      let levelScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      let levelTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

      placementQuestions.forEach((q, i) => {
        levelTotals[q.level]++
        if (answers[i] === q.answer || (i === currentQ && selectedAnswer === q.answer)) {
          levelScores[q.level]++
        }
      })

      // Determine level: highest level where >= 70% correct
      let recommendedLevel = 1
      for (let l = 6; l >= 1; l--) {
        if (levelTotals[l] > 0 && (levelScores[l] / levelTotals[l]) >= 0.7) {
          recommendedLevel = l
          break
        }
      }

      const progress = getProgress()
      progress.placementTaken = true
      progress.placementLevel = recommendedLevel
      saveProgress(progress)

      setShowResult(true)
    }
  }

  const getRecommendedLevel = () => {
    let levelScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    let levelTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }

    placementQuestions.forEach((q, i) => {
      levelTotals[q.level]++
      if (answers[i] === q.answer) {
        levelScores[q.level]++
      }
    })

    let recommendedLevel = 1
    for (let l = 6; l >= 1; l--) {
      if (levelTotals[l] > 0 && (levelScores[l] / levelTotals[l]) >= 0.7) {
        recommendedLevel = l
        break
      }
    }
    return recommendedLevel
  }

  // Start Screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold mb-2">Placement Test</h1>
          <p className="text-gray-500 text-sm">
            Tes ini akan menentukan level bahasa Mandarin kamu. Jawab {placementQuestions.length} soal
            untuk mengetahui di HSK mana kamu sebaiknya mulai.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-bold text-sm mb-3">📋 Yang Diuji:</h3>
          <div className="space-y-2">
            {[
              { level: 'HSK 1-2', desc: 'Kosakata dasar & sapaan', icon: '🌱' },
              { level: 'HSK 3-4', desc: 'Grammar menengah & kosakata', icon: '📚' },
              { level: 'HSK 5-6', desc: 'Idiom & kosakata lanjutan', icon: '🏆' },
            ].map(item => (
              <div key={item.level} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium text-sm">{item.level}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={startTest}
          className="w-full bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl py-4 font-bold text-lg"
        >
          🚀 Mulai Tes
        </button>
      </div>
    )
  }

  // Results
  if (showResult) {
    const level = getRecommendedLevel()
    const levelInfo = {
      1: { title: 'Pemula', desc: 'Kamu perlu mulai dari dasar. Fokus pada HSK 1.', icon: '🌱' },
      2: { title: 'Pemula+', desc: 'Kamu sudah tahu sedikit. Mulai dari HSK 2.', icon: '📗' },
      3: { title: 'Menengah', desc: 'Kamu punya dasar yang bagus. Lanjut ke HSK 3.', icon: '📘' },
      4: { title: 'Menengah+', desc: 'Kamu cukup mahir. Lanjut ke HSK 4.', icon: '📙' },
      5: { title: 'Lanjutan', desc: 'Kamu sudah sangat mahir. Lanjut ke HSK 5.', icon: '📕' },
      6: { title: 'Master', desc: 'Kamu hampir menguasai! Lanjut ke HSK 6.', icon: '👑' },
    }[level]

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm text-center mb-4">
          <div className="text-5xl mb-4">{levelInfo.icon}</div>
          <h2 className="text-xl font-bold mb-2">Hasil Placement Test</h2>
          <div className="text-4xl font-bold text-red-500 mb-2">HSK {level}</div>
          <div className="text-lg font-medium mb-1">{levelInfo.title}</div>
          <p className="text-sm text-gray-500 mb-4">{levelInfo.desc}</p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1,2,3,4,5,6].map(l => {
              let correct = 0, total = 0
              placementQuestions.forEach((q, i) => {
                if (q.level === l) {
                  total++
                  if (answers[i] === q.answer) correct++
                }
              })
              return total > 0 ? (
                <div key={l} className={`p-2 rounded-lg text-center ${l <= level ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="text-xs text-gray-500">HSK {l}</div>
                  <div className="font-bold text-sm">{correct}/{total}</div>
                </div>
              ) : null
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/lessons')}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl py-3 font-bold"
          >
            📚 Mulai Belajar HSK {level}
          </button>
          <button
            onClick={startTest}
            className="flex-1 bg-gray-100 rounded-xl py-3 font-medium"
          >
            🔄 Tes Ulang
          </button>
        </div>
      </div>
    )
  }

  // Question View
  const question = placementQuestions[currentQ]
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setStarted(false)} className="text-sm text-gray-500">← Keluar</button>
        <span className="text-sm font-medium">Placement Test</span>
        <span className="text-sm text-gray-500">{currentQ + 1}/{placementQuestions.length}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div
          className="bg-red-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / placementQuestions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
        <div className="mb-2">
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600">
            HSK {question.level}
          </span>
        </div>
        <h2 className="text-lg font-bold mb-4">{question.q}</h2>

        <div className="space-y-2">
          {question.options.map((option, i) => {
            let btnClass = 'bg-gray-50 hover:bg-gray-100'
            if (selectedAnswer !== null) {
              if (i === question.answer) btnClass = 'bg-green-100 border-green-400'
              else if (i === selectedAnswer && i !== question.answer) btnClass = 'bg-red-100 border-red-400'
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnClass}`}
              >
                <span className="font-bold text-gray-400 mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {selectedAnswer !== null && (
        <button
          onClick={nextQuestion}
          className="w-full bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl py-3 font-bold animate-bounce-in"
        >
          {currentQ < placementQuestions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 📊'}
        </button>
      )}
    </div>
  )
}
