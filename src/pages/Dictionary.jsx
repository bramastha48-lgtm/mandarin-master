import { useState } from 'react'
import extendedDictionary from '../data/dictionary'
import { radicalList } from '../data/dictionary'
import { addWordLearned } from '../utils/progress'
import { speak } from '../utils/tts'

export default function Dictionary() {
  const [search, setSearch] = useState('')
  const [filterHSK, setFilterHSK] = useState(0)
  const [filterType, setFilterType] = useState('')
  const [selectedWord, setSelectedWord] = useState(null)
  const [showRadicals, setShowRadicals] = useState(false)

  const hskLevels = [0, 1, 2, 3, 4, 5, 6]
  const types = [...new Set(extendedDictionary.map(d => d.type))].sort()

  const filtered = extendedDictionary.filter(word => {
    const matchSearch = !search ||
      word.character.includes(search) ||
      word.pinyin.toLowerCase().includes(search.toLowerCase()) ||
      word.meaning.toLowerCase().includes(search.toLowerCase())
    const matchHSK = filterHSK === 0 || word.hsk === filterHSK
    const matchType = !filterType || word.type === filterType
    return matchSearch && matchHSK && matchType
  })

  const handleWordClick = (word) => {
    setSelectedWord(word)
    addWordLearned(word)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">📖 Kamus Mandarin-Indonesia</h1>
      <p className="text-gray-500 text-sm mb-5">{extendedDictionary.length} kata tersedia</p>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari: karakter, pinyin, atau arti..."
          className="w-full bg-white rounded-xl px-5 py-3.5 pl-12 shadow-sm border border-gray-200 focus:border-red-400 focus:outline-none text-sm"
        />
        <span className="absolute left-4 top-4 text-gray-400 text-lg">🔍</span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-4 text-gray-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* HSK Filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {hskLevels.map(level => (
          <button
            key={level}
            onClick={() => setFilterHSK(level)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
              filterHSK === level
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white text-gray-600'
            }`}
          >
            {level === 0 ? 'Semua' : `HSK ${level}`}
          </button>
        ))}
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('')}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
            !filterType ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
          }`}
        >
          Semua Tipe
        </button>
        {types.slice(0, 10).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
              filterType === type ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Radicals Toggle */}
      <button
        onClick={() => setShowRadicals(!showRadicals)}
        className="w-full bg-white rounded-xl p-4 shadow-sm mb-4 flex items-center justify-between"
      >
        <span className="text-sm font-medium">📚 Radikal (部首) - Komponen Dasar Karakter</span>
        <span className="text-gray-400">{showRadicals ? '▲' : '▼'}</span>
      </button>

      {showRadicals && (
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="grid grid-cols-4 gap-2">
            {radicalList.map(r => (
              <div key={r.radical} className="p-2 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{r.radical}</div>
                <div className="text-xs text-gray-500">{r.name}</div>
                <div className="text-xs text-gray-400">{r.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="text-xs text-gray-500 mb-3">
        Menampilkan {filtered.length} kata
      </div>

      {/* Word List */}
      <div className="space-y-2">
        {filtered.slice(0, 60).map(word => (
          <div
            key={word.id}
            onClick={() => handleWordClick(word)}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-99"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-red-600">
                  {word.character.length > 3 ? word.character.substring(0, 2) : word.character}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg">{word.character}</div>
                <div className="text-sm text-gray-500">{word.pinyin}</div>
                <div className="text-sm">{word.meaning}</div>
              </div>
              <div className="flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                  word.hsk <= 2 ? 'bg-green-500' :
                  word.hsk <= 4 ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}>
                  HSK {word.hsk}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 60 && (
        <div className="text-center text-sm text-gray-500 mt-4 py-3">
          Dan {filtered.length - 60} kata lainnya... (ketik untuk mempersempit pencarian)
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setSelectedWord(null)}>
          <div className="bg-white rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-bounce-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-6 pt-6 pb-3 border-b border-gray-100">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-4xl font-bold mb-1">{selectedWord.character}</div>
                  <div className="text-lg text-gray-500">{selectedWord.pinyin}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => speak(selectedWord.character)}
                    className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => setSelectedWord(null)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4 flex gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                  selectedWord.hsk <= 2 ? 'bg-green-500' :
                  selectedWord.hsk <= 4 ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}>
                  HSK {selectedWord.hsk}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                  {selectedWord.type}
                </span>
              </div>

              <div className="text-xl font-medium mb-5">{selectedWord.meaning}</div>

              <div>
                <h4 className="font-bold text-sm text-gray-500 mb-3">Contoh Kalimat:</h4>
                {selectedWord.examples.map((ex, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl mb-2 text-sm leading-relaxed">
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
