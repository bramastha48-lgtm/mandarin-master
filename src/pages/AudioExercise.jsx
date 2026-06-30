import { useState, useEffect, useRef } from 'react'
import { speak, speakSlow, stopSpeaking, isSupported, initTTS } from '../utils/tts'
import { dictionary } from '../data/dictionary'
import { addXP } from '../utils/progress'

export default function AudioExercise() {
  const [mode, setMode] = useState(null) // 'listening' | 'pronunciation'
  const [currentWord, setCurrentWord] = useState(null)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [ttsReady, setTtsReady] = useState(false)
  const [pronunciationWord, setPronunciationWord] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [pronunciationResult, setPronunciationResult] = useState(null)
  const [difficulty, setDifficulty] = useState('easy')
  const recognitionRef = useRef(null)

  useEffect(() => {
    initTTS().then(ok => setTtsReady(ok))
    return () => stopSpeaking()
  }, [])

  // ===== LISTENING MODE =====
  const startListening = () => {
    setMode('listening')
    setScore(0)
    setTotal(0)
    nextListeningQuestion()
  }

  const nextListeningQuestion = () => {
    setSelected(null)
    setShowResult(false)

    const hskFilter = difficulty === 'easy' ? [1, 2] : difficulty === 'medium' ? [3, 4] : [5, 6]
    const filtered = dictionary.filter(w => hskFilter.includes(w.hsk))
    const word = filtered[Math.floor(Math.random() * filtered.length)]

    // Generate wrong options
    const otherWords = filtered.filter(w => w.character !== word.character)
    const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 3)
    const allOptions = [word, ...shuffled].sort(() => Math.random() - 0.5)

    setCurrentWord(word)
    setOptions(allOptions)

    // Auto play the word
    setTimeout(() => playWord(word.character), 500)
  }

  const playWord = async (text) => {
    if (!ttsReady) return
    setIsPlaying(true)
    try {
      await speak(text)
    } catch (e) {
      console.error('TTS error:', e)
    }
    setIsPlaying(false)
  }

  const playSlow = async (text) => {
    if (!ttsReady) return
    setIsPlaying(true)
    try {
      await speakSlow(text)
    } catch (e) {
      console.error('TTS error:', e)
    }
    setIsPlaying(false)
  }

  const handleListeningAnswer = (option) => {
    if (selected) return
    setSelected(option)
    setShowResult(true)
    setTotal(t => t + 1)

    if (option.character === currentWord.character) {
      setScore(s => s + 1)
      addXP(5)
    }
  }

  // ===== PRONUNCIATION MODE =====
  const startPronunciation = () => {
    setMode('pronunciation')
    setScore(0)
    setTotal(0)
    nextPronunciationWord()
  }

  const nextPronunciationWord = () => {
    setPronunciationResult(null)
    setIsRecording(false)

    const hskFilter = difficulty === 'easy' ? [1, 2] : difficulty === 'medium' ? [3, 4] : [5, 6]
    const filtered = dictionary.filter(w => hskFilter.includes(w.hsk))
    const word = filtered[Math.floor(Math.random() * filtered.length)]
    setPronunciationWord(word)
  }

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setPronunciationResult({
        success: false,
        message: 'Browser tidak mendukung speech recognition. Coba gunakan Chrome.'
      })
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsRecording(true)

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      const confidence = event.results[0][0].confidence

      setTotal(t => t + 1)

      if (result.includes(pronunciationWord.character) || pronunciationWord.character.includes(result)) {
        setScore(s => s + 1)
        addXP(5)
        setPronunciationResult({
          success: true,
          message: `✅ Bagus! Kamu mengucapkan "${result}" dengan benar!`,
          confidence: Math.round(confidence * 100)
        })
      } else {
        setPronunciationResult({
          success: false,
          message: `Kamu mengucapkan "${result}", coba lagi! Target: ${pronunciationWord.character}`,
          confidence: Math.round(confidence * 100)
        })
      }
    }

    recognition.onerror = (event) => {
      setPronunciationResult({
        success: false,
        message: `Error: ${event.error}. Coba lagi.`
      })
    }

    recognition.onend = () => setIsRecording(false)

    recognition.start()
    recognitionRef.current = recognition
  }

  // ===== MODE SELECTION =====
  if (!mode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">🎧 Latihan Audio</h1>
        <p className="text-gray-500 text-sm mb-6">Latih kemampuan mendengar dan pengucapan</p>

        {/* Difficulty */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="text-sm font-medium mb-2">Tingkat Kesulitan</div>
          <div className="flex gap-2">
            {[
              { id: 'easy', label: 'Mudah', desc: 'HSK 1-2', color: 'green' },
              { id: 'medium', label: 'Sedang', desc: 'HSK 3-4', color: 'blue' },
              { id: 'hard', label: 'Sulit', desc: 'HSK 5-6', color: 'purple' },
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`flex-1 p-3 rounded-lg text-center transition-all ${
                  difficulty === d.id
                    ? `bg-${d.color}-100 border-2 border-${d.color}-400`
                    : 'bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-sm font-bold">{d.label}</div>
                <div className="text-xs text-gray-500">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={startListening}
            className="w-full bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all text-left border-l-4 border-blue-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">👂</div>
              <div>
                <div className="font-bold text-lg">Latihan Mendengar</div>
                <div className="text-sm text-gray-500">Dengarkan suara, pilih kata yang benar</div>
              </div>
            </div>
          </button>

          <button
            onClick={startPronunciation}
            className="w-full bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all text-left border-l-4 border-green-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl">🎤</div>
              <div>
                <div className="font-bold text-lg">Latihan Pengucapan</div>
                <div className="text-sm text-gray-500">Ucapkan kata, AI akan menilai</div>
              </div>
            </div>
          </button>
        </div>

        {!ttsReady && (
          <div className="mt-4 bg-yellow-50 rounded-xl p-3 text-sm text-yellow-700">
            ⚠️ Text-to-Speech mungkin tidak tersedia di browser ini. Gunakan Chrome untuk hasil terbaik.
          </div>
        )}
      </div>
    )
  }

  // ===== LISTENING MODE =====
  if (mode === 'listening') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setMode(null); stopSpeaking() }} className="text-sm text-gray-500">← Kembali</button>
          <span className="text-sm font-medium">👂 Mendengar</span>
          <span className="text-sm text-gray-500">{score}/{total}</span>
        </div>

        {/* Score */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4 text-center">
          <div className="text-3xl font-bold text-blue-500">{score}</div>
          <div className="text-xs text-gray-500">dari {total} benar</div>
        </div>

        {/* Play Button */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4 text-center">
          <div className="text-sm text-gray-500 mb-4">Dengarkan dan pilih kata yang benar:</div>

          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => playWord(currentWord?.character)}
              disabled={isPlaying}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
                isPlaying
                  ? 'bg-blue-200 pulse-glow'
                  : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
              }`}
            >
              {isPlaying ? '🔊' : '▶️'}
            </button>
            <button
              onClick={() => playSlow(currentWord?.character)}
              disabled={isPlaying}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg self-center"
              title="Putar pelan"
            >
              🐢
            </button>
          </div>

          <div className="text-xs text-gray-400">Klik untuk mendengar ulang</div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {options.map((opt, i) => {
            let btnClass = 'bg-white hover:bg-gray-50'
            if (selected) {
              if (opt.character === currentWord.character) btnClass = 'bg-green-100 border-2 border-green-400'
              else if (opt === selected && opt.character !== currentWord.character) btnClass = 'bg-red-100 border-2 border-red-400'
            }
            return (
              <button
                key={i}
                onClick={() => handleListeningAnswer(opt)}
                disabled={!!selected}
                className={`w-full text-left p-5 rounded-xl shadow-sm transition-all ${btnClass}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold">
                    {['A', 'B', 'C', 'D'][i]}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{opt.character}</div>
                    <div className="text-sm text-gray-500">{opt.pinyin}</div>
                    <div className="text-sm">{opt.meaning}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className={`rounded-xl p-4 mb-4 animate-bounce-in ${
            selected?.character === currentWord.character ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="font-bold text-sm mb-1">
              {selected?.character === currentWord.character ? '✅ Benar!' : '❌ Salah!'}
            </div>
            <div className="text-sm">
              Jawaban: <strong>{currentWord.character}</strong> ({currentWord.pinyin}) = {currentWord.meaning}
            </div>
          </div>
        )}

        {showResult && (
          <button
            onClick={nextListeningQuestion}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 font-bold"
          >
            Soal Berikutnya →
          </button>
        )}
      </div>
    )
  }

  // ===== PRONUNCIATION MODE =====
  if (mode === 'pronunciation') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setMode(null); stopSpeaking() }} className="text-sm text-gray-500">← Kembali</button>
          <span className="text-sm font-medium">🎤 Pengucapan</span>
          <span className="text-sm text-gray-500">{score}/{total}</span>
        </div>

        {pronunciationWord && (
          <>
            {/* Word Display */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-4 text-center">
              <div className="text-5xl font-bold mb-2">{pronunciationWord.character}</div>
              <div className="text-xl text-gray-500 mb-1">{pronunciationWord.pinyin}</div>
              <div className="text-lg mb-4">{pronunciationWord.meaning}</div>

              <button
                onClick={() => playWord(pronunciationWord.character)}
                disabled={isPlaying}
                className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm"
              >
                {isPlaying ? '🔊 Playing...' : '🔊 Dengarkan'}
              </button>
            </div>

            {/* Record Button */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-4 text-center">
              <div className="text-sm text-gray-500 mb-4">Tekan tombol dan ucapkan kata di atas:</div>

              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto transition-all ${
                  isRecording
                    ? 'bg-red-500 pulse-glow animate-pulse'
                    : 'bg-red-100 hover:bg-red-200 active:scale-95'
                }`}
              >
                {isRecording ? '⏹️' : '🎤'}
              </button>

              <div className="text-xs text-gray-400 mt-3">
                {isRecording ? 'Merekam... Ucapkan sekarang!' : 'Tekan untuk mulai merekam'}
              </div>
            </div>

            {/* Result */}
            {pronunciationResult && (
              <div className={`rounded-xl p-4 mb-4 animate-bounce-in ${
                pronunciationResult.success ? 'bg-green-50' : 'bg-yellow-50'
              }`}>
                <div className="font-bold text-sm mb-1">{pronunciationResult.message}</div>
                {pronunciationResult.confidence !== undefined && (
                  <div className="text-xs text-gray-500">
                    Kepercayaan: {pronunciationResult.confidence}%
                  </div>
                )}
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={nextPronunciationWord}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-3 font-bold"
            >
              Kata Berikutnya →
            </button>
          </>
        )}
      </div>
    )
  }
}
