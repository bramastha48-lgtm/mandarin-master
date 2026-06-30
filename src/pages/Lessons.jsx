import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons'
import { getProgress } from '../utils/progress'

export default function Lessons() {
  const progress = getProgress()

  const hskGroups = [1, 2, 3, 4, 5, 6].map(hsk => ({
    hsk,
    lessons: lessons.filter(l => l.hsk === hsk)
  }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">Pelajaran</h1>
      <p className="text-gray-500 text-sm mb-6">Pelajari bahasa Mandarin dari dasar sampai mahir</p>

      {hskGroups.map(({ hsk, lessons: groupLessons }) => (
        <div key={hsk} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
              hsk <= 2 ? 'bg-green-500' :
              hsk <= 4 ? 'bg-blue-500' :
              'bg-purple-500'
            }`}>
              HSK {hsk}
            </span>
            <span className="text-sm text-gray-500">
              {groupLessons.filter(l => progress.completedLessons.includes(l.id)).length}/{groupLessons.length} selesai
            </span>
          </div>

          <div className="space-y-3">
            {groupLessons.map(lesson => {
              const isCompleted = progress.completedLessons.includes(lesson.id)
              return (
                <Link
                  key={lesson.id}
                  to={`/lesson/${lesson.id}`}
                  className={`block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                    isCompleted ? 'border-2 border-green-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isCompleted ? 'bg-green-100' : 'bg-red-50'
                    }`}>
                      {isCompleted ? '✅' : lesson.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{lesson.title}</div>
                      <div className="text-xs text-gray-500">{lesson.titleCn}</div>
                      <div className="text-xs text-gray-400 mt-1">{lesson.description}</div>
                    </div>
                    <div className="text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
