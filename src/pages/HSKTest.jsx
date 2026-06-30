import { useState } from 'react'
import { hskQuestions } from '../data/hsk'
import { saveHSKScore } from '../utils/progress'
import { speak } from '../utils/tts'

export default function HSKTest() {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const startTest = (level) => {
    setSelectedLevel(level)
    setCurrentQ(0)
    setAnswers({})
    setShowResult(false)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const questions = selectedLevel ? hskQuestions[selectedLevel] : []
  const question = questions[currentQ]

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setAnswers({ ...answers, [currentQ]: index })
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      let score = 0
      questions.forEach((q, i) => {
        if (answers[i] === q.answer || (i === currentQ && selectedAnswer === q.answer)) {
          score++
        }
      })
      saveHSKScore(selectedLevel, score, questions.length)
      setShowResult(true)
    }
  }

  const getScore = () => {
    let score = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++
    })
    return score
  }

  const getPercentage = () => {
    return Math.round((getScore() / questions.length) * 100)
  }

  // Level Selection
  if (!selectedLevel) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">📝 Soal HSK</h1>
        <p className="text-gray-500 text-sm mb-6">Uji kemampuan bahasa Mandarin kamu</p>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map(level => (
            <button
              key={level}
              onClick={() => startTest(level)}
              className={`w-full bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all text-left ${
                level <= 2 ? 'border-l-4 border-green-400' :
                level <= 4 ? 'border-l-4 border-blue-400' :
                'border-l-4 border-purple-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xl">HSK {level}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {level <= 2 ? 'Pemula' : level <= 4 ? 'Menengah' : 'Lanjutan'} · {hskQuestions[level]?.length || 0} soal
                  </div>
                </div>
                <div className="text-3xl">
                  {level <= 2 ? '🌱' : level <= 4 ? '📚' : '🏆'}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-2">ℹ️ Tentang HSK</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            HSK (Hanyu Shuiping Kaoshi) adalah ujian standar kemampuan bahasa Mandarin untuk penutur asing.
            Terdiri dari 6 level: HSK 1 (pemula) sampai HSK 6 (mahir).
          </p>
        </div>
      </div>
    )
  }

  // Results
  if (showResult) {
    const score = getScore()
    const percentage = getPercentage()
    const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'
    const gradeColor = { A: 'text-green-500', B: 'text-blue-500', C: 'text-orange-500', D: 'text-red-500' }[grade]
    const gradeText = { A: 'Luar Biasa!', B: 'Bagus!', C: 'Cukup', D: 'Perlu Belajar Lagi' }[grade]

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm text-center mb-5">
          <div className="text-5xl mb-4">
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : percentage >= 40 ? '😊' : '💪'}
          </div>
          <h2 className="text-xl font-bold mb-1">Hasil HSK {selectedLevel}</h2>
          <div className={`text-6xl font-bold ${gradeColor} mb-2`}>{grade}</div>
          <div className="text-lg font-medium mb-1">{gradeText}</div>
          <div className="text-gray-500 mb-4">{score}/{questions.length} benar ({percentage}%)</div>

          <div className="w-full bg-gray-100 rounded-full h-4 mb-6">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${
                percentage >= 80 ? 'bg-green-500' :
                percentage >= 60 ? 'bg-blue-500' :
                percentage >= 40 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-500">{score}</div>
              <div className="text-sm text-gray-500">Benar</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-500">{questions.length - score}</div>
              <div className="text-sm text-gray-500">Salah</div>
            </div>
          </div>
        </div>

        {/* Review Answers */}
        <div className="space-y-4 mb-5">
          {questions.map((q, i) => {
            const userAnswer = answers[i]
            const isCorrect = userAnswer === q.answer
            return (
              <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${
                isCorrect ? 'border-green-400' : 'border-red-400'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{isCorrect ? '✅' : '❌'}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-2">{q.question}</div>
                    {!isCorrect && (
                      <div className="text-sm text-gray-500 mb-1">
                        Jawaban kamu: <span className="text-red-500">{q.options[userAnswer]}</span>
                        <br />
                        Jawaban benar: <span className="text-green-500">{q.options[q.answer]}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">{q.explanation}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => startTest(selectedLevel)}
            className="flex-1 bg-blue-500 text-white rounded-xl py-4 font-bold"
          >
            🔄 Coba Lagi
          </button>
          <button
            onClick={() => setSelectedLevel(null)}
            className="flex-1 bg-gray-100 rounded-xl py-4 font-bold"
          >
            ← Pilih Level
          </button>
        </div>
      </div>
    )
  }

  // Question View
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setSelectedLevel(null)} className="text-sm text-gray-500">← Keluar</button>
        <span className="text-sm font-bold">HSK {selectedLevel}</span>
        <span className="text-sm text-gray-500">{currentQ + 1}/{questions.length}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
        <div
          className="bg-red-500 h-3 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
        <div className="mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
            {question.type === 'pilih' ? 'Pilihan Ganda' : question.type === 'pinyin' ? 'Pinyin' : 'Susun Kalimat'}
          </span>
        </div>
        <h2 className="text-xl font-bold mb-5">{question.question}</h2>

        {question.type === 'susun' ? (
          <div>
            <div className="p-5 bg-gray-50 rounded-xl mb-4 text-center font-mono text-lg">
              {question.question.split(' ').filter(w => w !== 'Susun' && w !== 'kalimat:').join(' ')}
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-sm font-bold text-blue-800 mb-1">Jawaban:</div>
              <div className="font-bold text-lg">{question.answer}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {question.options.map((option, i) => {
              let btnClass = 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              if (selectedAnswer !== null) {
                if (i === question.answer) btnClass = 'bg-green-50 border-2 border-green-400'
                else if (i === selectedAnswer && i !== question.answer) btnClass = 'bg-red-50 border-2 border-red-400'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-5 rounded-xl transition-all ${btnClass}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAnswer !== null && i === question.answer ? 'bg-green-500 text-white' :
                      selectedAnswer === i && i !== question.answer ? 'bg-red-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                    <span className="text-base">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-blue-50 rounded-xl p-5 mb-5 animate-bounce-in border-l-4 border-blue-400">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <div className="font-bold text-sm text-blue-800 mb-1">Penjelasan</div>
              <div className="text-sm text-gray-600 leading-relaxed">{question.explanation}</div>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {selectedAnswer !== null && (
        <button
          onClick={nextQuestion}
          className="w-full bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl py-4 font-bold text-lg animate-bounce-in"
        >
          {currentQ < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 📊'}
        </button>
      )}
    </div>
  )
}
