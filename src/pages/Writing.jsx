import { useState, useRef, useEffect } from 'react'
import { incrementWritingPractice, addXP } from '../utils/progress'
import { getStrokeGuide, StrokeCounter, compareCharacters } from '../utils/strokes'
import { speak } from '../utils/tts'

const practiceChars = [
  { char: '一', pinyin: 'yī', meaning: 'satu', strokes: 1 },
  { char: '二', pinyin: 'èr', meaning: 'dua', strokes: 2 },
  { char: '三', pinyin: 'sān', meaning: 'tiga', strokes: 3 },
  { char: '人', pinyin: 'rén', meaning: 'orang', strokes: 2 },
  { char: '大', pinyin: 'dà', meaning: 'besar', strokes: 3 },
  { char: '小', pinyin: 'xiǎo', meaning: 'kecil', strokes: 3 },
  { char: '口', pinyin: 'kǒu', meaning: 'mulut', strokes: 3 },
  { char: '日', pinyin: 'rì', meaning: 'hari', strokes: 4 },
  { char: '月', pinyin: 'yuè', meaning: 'bulan', strokes: 4 },
  { char: '水', pinyin: 'shuǐ', meaning: 'air', strokes: 4 },
  { char: '火', pinyin: 'huǒ', meaning: 'api', strokes: 4 },
  { char: '山', pinyin: 'shān', meaning: 'gunung', strokes: 3 },
  { char: '木', pinyin: 'mù', meaning: 'kayu', strokes: 4 },
  { char: '金', pinyin: 'jīn', meaning: 'emas', strokes: 8 },
  { char: '王', pinyin: 'wáng', meaning: 'raja', strokes: 4 },
  { char: '女', pinyin: 'nǚ', meaning: 'perempuan', strokes: 3 },
  { char: '子', pinyin: 'zǐ', meaning: 'anak', strokes: 3 },
  { char: '心', pinyin: 'xīn', meaning: 'hati', strokes: 4 },
  { char: '中', pinyin: 'zhōng', meaning: 'tengah', strokes: 4 },
  { char: '国', pinyin: 'guó', meaning: 'negara', strokes: 8 },
  { char: '好', pinyin: 'hǎo', meaning: 'baik', strokes: 6 },
  { char: '我', pinyin: 'wǒ', meaning: 'saya', strokes: 7 },
  { char: '你', pinyin: 'nǐ', meaning: 'kamu', strokes: 7 },
  { char: '他', pinyin: 'tā', meaning: 'dia', strokes: 5 },
  { char: '她', pinyin: 'tā', meaning: 'dia (P)', strokes: 6 },
  { char: '的', pinyin: 'de', meaning: 'punya', strokes: 8 },
  { char: '是', pinyin: 'shì', meaning: 'adalah', strokes: 9 },
  { char: '不', pinyin: 'bù', meaning: 'tidak', strokes: 4 },
  { char: '了', pinyin: 'le', meaning: 'sudah', strokes: 2 },
  { char: '在', pinyin: 'zài', meaning: 'di', strokes: 6 },
]

export default function Writing() {
  const canvasRef = useRef(null)
  const guideCanvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentChar, setCurrentChar] = useState(0)
  const [showGuide, setShowGuide] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [strokeCounter] = useState(new StrokeCounter())
  const [feedback, setFeedback] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const practice = practiceChars[currentChar]

  useEffect(() => {
    drawCanvas()
  }, [currentChar, showGuide])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const guideCanvas = guideCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])

    // Center cross
    ctx.beginPath()
    ctx.moveTo(150, 0)
    ctx.lineTo(150, 300)
    ctx.moveTo(0, 150)
    ctx.lineTo(300, 150)
    ctx.stroke()

    // Diagonal cross
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(300, 300)
    ctx.moveTo(300, 0)
    ctx.lineTo(0, 300)
    ctx.stroke()

    ctx.setLineDash([])

    // Border
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, 298, 298)

    if (showGuide && guideCanvas) {
      // Draw guide character on separate canvas
      const gCtx = guideCanvas.getContext('2d')
      gCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height)
      gCtx.font = '200px serif'
      gCtx.fillStyle = 'rgba(200,200,200,0.25)'
      gCtx.textAlign = 'center'
      gCtx.textBaseline = 'middle'
      gCtx.fillText(practice.char, 150, 155)
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#e74c3c'
    setIsDrawing(true)
    strokeCounter.startStroke()
    setShowFeedback(false)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      strokeCounter.endStroke()
    }
  }

  const clearCanvas = () => {
    strokeCounter.reset()
    setFeedback(null)
    setShowFeedback(false)
    drawCanvas()
  }

  const checkWriting = () => {
    const drawnStrokes = strokeCounter.getCount()
    const expectedStrokes = practice.strokes

    let result
    if (drawnStrokes === 0) {
      result = { type: 'warning', message: '⚠️ Kamu belum menulis apapun. Coba tulis karakternya!' }
    } else if (drawnStrokes === expectedStrokes) {
      result = { type: 'success', message: `✅ Bagus! Jumlah goresan benar (${drawnStrokes}/${expectedStrokes})` }
      incrementWritingPractice()
      addXP(5)
      setAttempts(a => a + 1)
    } else if (drawnStrokes < expectedStrokes) {
      result = { type: 'error', message: `❌ Goresan kurang ${expectedStrokes - drawnStrokes}. Kamu menulis ${drawnStrokes}, seharusnya ${expectedStrokes} goresan.` }
    } else {
      result = { type: 'error', message: `❌ Goresan kelebihan ${drawnStrokes - expectedStrokes}. Kamu menulis ${drawnStrokes}, seharusnya ${expectedStrokes} goresan.` }
    }

    // Get stroke guide
    const guide = getStrokeGuide(practice.char)
    if (guide) {
      result.guide = guide.guide
    }

    setFeedback(result)
    setShowFeedback(true)
  }

  const playSound = () => {
    speak(practice.char)
  }

  const nextChar = () => {
    setCurrentChar((currentChar + 1) % practiceChars.length)
    setFeedback(null)
    setShowFeedback(false)
    strokeCounter.reset()
  }

  const prevChar = () => {
    setCurrentChar((currentChar - 1 + practiceChars.length) % practiceChars.length)
    setFeedback(null)
    setShowFeedback(false)
    strokeCounter.reset()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">✍️ Latihan Menulis</h1>
      <p className="text-gray-500 text-sm mb-4">Latihan menulis karakter Mandarin</p>

      {/* Character Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <button onClick={prevChar} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">←</button>
          <div className="text-center flex-1">
            <div className="text-5xl font-bold mb-1">{practice.char}</div>
            <div className="text-lg text-gray-500">{practice.pinyin}</div>
            <div className="text-sm">{practice.meaning}</div>
            <div className="text-xs text-gray-400 mt-1">Goresan: {practice.strokes}</div>
          </div>
          <button onClick={nextChar} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">→</button>
        </div>

        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={playSound}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm"
          >
            🔊 Dengarkan
          </button>
        </div>
      </div>

      {/* Stroke Guide */}
      {showGuide && (
        <div className="bg-orange-50 rounded-xl p-3 mb-4 border-l-4 border-orange-400">
          <div className="text-sm font-medium text-orange-800">
            📐 Panduan Goresan: {getStrokeGuide(practice.char)?.guide || 'Ikuti bentuk karakter di atas'}
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Area Menulis</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${showGuide ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              {showGuide ? '📐 Panduan ON' : '📐 Panduan OFF'}
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1 rounded-full text-xs bg-gray-100 font-medium"
            >
              🗑️ Hapus
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-[300px] mx-auto" style={{ aspectRatio: '1/1' }}>
          {/* Guide canvas (background) */}
          {showGuide && (
            <canvas
              ref={guideCanvasRef}
              width={300}
              height={300}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}
          {/* Drawing canvas */}
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="writing-canvas w-full h-full relative z-10"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Stroke Counter */}
        <div className="text-center mt-3 text-sm text-gray-500">
          Goresan ditulis: <span className="font-bold text-lg text-gray-700">{strokeCounter.getCount()}</span> / {practice.strokes}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={checkWriting}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-3 font-bold text-sm"
          >
            ✅ Cek Tulisan
          </button>
          <button
            onClick={clearCanvas}
            className="flex-1 bg-gray-100 rounded-lg py-3 font-medium text-sm"
          >
            🔄 Ulangi
          </button>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && feedback && (
        <div className={`rounded-xl p-4 mb-4 animate-bounce-in ${
          feedback.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
          feedback.type === 'error' ? 'bg-red-50 border-l-4 border-red-400' :
          'bg-yellow-50 border-l-4 border-yellow-400'
        }`}>
          <div className="font-bold text-sm mb-1">{feedback.message}</div>
          {feedback.guide && (
            <div className="text-xs text-gray-600 mt-2">
              📝 Cara menulis: {feedback.guide}
            </div>
          )}
          {feedback.type === 'success' && (
            <div className="text-xs text-green-600 mt-1">+5 XP</div>
          )}
        </div>
      )}

      {/* Stats */}
      {attempts > 0 && (
        <div className="bg-white rounded-xl p-3 shadow-sm mb-4 text-center">
          <span className="text-sm text-gray-500">Latihan berhasil: <strong>{attempts}x</strong> · Total: <strong>{attempts * 5} XP</strong></span>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-sm mb-2">💡 Tips Menulis</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>Aturan goresan:</strong> Kiri ke kanan, atas ke bawah</li>
          <li>• <strong>Horizontal dulu:</strong> Garis horizontal sebelum vertikal</li>
          <li>• <strong>Luas dulu:</strong> Goresan yang menutupi area luas ditulis duluan</li>
          <li>• <strong>Dalam dulu:</strong> Goresan di dalam ditulis sebelum yang menutup</li>
          <li>• Klik <strong>🔊 Dengarkan</strong> untuk mendengar cara mengucapkan</li>
          <li>• Klik <strong>✅ Cek Tulisan</strong> untuk mengecek jumlah goresan</li>
        </ul>
      </div>
    </div>
  )
}
