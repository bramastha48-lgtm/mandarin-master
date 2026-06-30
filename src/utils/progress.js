// Progress tracking utilities

const STORAGE_KEY = 'mandarin-master-progress';

export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultProgress();
  } catch {
    return getDefaultProgress();
  }
}

function getDefaultProgress() {
  return {
    level: 1,
    xp: 0,
    streak: 0,
    lastActive: null,
    completedLessons: [],
    hskScores: {},
    wordsLearned: [],
    writingPractice: 0,
    chatMessages: 0,
    dailyXP: {},
    achievements: [],
    placementTaken: false,
    placementLevel: 1,
  };
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function addXP(amount) {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];

  progress.xp += amount;

  // Track daily XP
  if (!progress.dailyXP) progress.dailyXP = {};
  progress.dailyXP[today] = (progress.dailyXP[today] || 0) + amount;

  // Level up: every 100 XP
  const newLevel = Math.floor(progress.xp / 100) + 1;
  if (newLevel > progress.level) {
    progress.level = newLevel;
  }

  // Streak tracking
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (progress.lastActive === today) {
    // Already active today
  } else if (progress.lastActive === yesterday) {
    progress.streak += 1;
  } else if (progress.lastActive !== today) {
    progress.streak = 1;
  }
  progress.lastActive = today;

  saveProgress(progress);
  return progress;
}

export function completeLesson(lessonId) {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    saveProgress(progress);
  }
  return addXP(20);
}

export function saveHSKScore(hskLevel, score, total) {
  const progress = getProgress();
  progress.hskScores[hskLevel] = {
    score,
    total,
    date: new Date().toISOString(),
    percentage: Math.round((score / total) * 100)
  };
  saveProgress(progress);
  return addXP(score * 2);
}

export function addWordLearned(word) {
  const progress = getProgress();
  if (!progress.wordsLearned.find(w => w.character === word.character)) {
    progress.wordsLearned.push({
      ...word,
      learnedAt: new Date().toISOString()
    });
    saveProgress(progress);
  }
  return addXP(5);
}

export function incrementWritingPractice() {
  const progress = getProgress();
  progress.writingPractice = (progress.writingPractice || 0) + 1;
  saveProgress(progress);
  return addXP(3);
}

export function incrementChatMessages() {
  const progress = getProgress();
  progress.chatMessages = (progress.chatMessages || 0) + 1;
  saveProgress(progress);
  return addXP(2);
}

export function getDailyXP() {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  return progress.dailyXP?.[today] || 0;
}

export function getWeeklyXP() {
  const progress = getProgress();
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    total += progress.dailyXP?.[date] || 0;
  }
  return total;
}

export function checkAchievements() {
  const progress = getProgress();
  const newAchievements = [];

  const checks = [
    { id: 'first_lesson', name: 'Langkah Pertama', icon: '🎯', check: () => progress.completedLessons.length >= 1 },
    { id: 'five_lessons', name: 'Pembelajar Rajin', icon: '📚', check: () => progress.completedLessons.length >= 5 },
    { id: 'ten_lessons', name: 'Master Pelajaran', icon: '🏆', check: () => progress.completedLessons.length >= 10 },
    { id: 'first_hsk', name: 'HSK Warrior', icon: '⚔️', check: () => Object.keys(progress.hskScores).length >= 1 },
    { id: 'all_hsk', name: 'HSK Legend', icon: '👑', check: () => Object.keys(progress.hskScores).length >= 6 },
    { id: 'word_10', name: 'Kolektor Kata', icon: '📝', check: () => progress.wordsLearned.length >= 10 },
    { id: 'word_50', name: 'Kamus Berjalan', icon: '📖', check: () => progress.wordsLearned.length >= 50 },
    { id: 'word_100', name: 'Master Kosakata', icon: '🎓', check: () => progress.wordsLearned.length >= 100 },
    { id: 'streak_3', name: 'Konsisten 3 Hari', icon: '🔥', check: () => progress.streak >= 3 },
    { id: 'streak_7', name: 'Seminggu Berturut', icon: '💪', check: () => progress.streak >= 7 },
    { id: 'streak_30', name: 'Sebulan Penuh', icon: '🌟', check: () => progress.streak >= 30 },
    { id: 'writer_10', name: 'Penulis Pemula', icon: '✏️', check: () => progress.writingPractice >= 10 },
    { id: 'writer_50', name: 'Master Kaligrafi', icon: '🖊️', check: () => progress.writingPractice >= 50 },
    { id: 'chat_10', name: 'Pembicara Ramah', icon: '💬', check: () => progress.chatMessages >= 10 },
    { id: 'chat_50', name: 'AI Chat Master', icon: '🤖', check: () => progress.chatMessages >= 50 },
    { id: 'xp_100', name: '100 XP!', icon: '⭐', check: () => progress.xp >= 100 },
    { id: 'xp_500', name: '500 XP!', icon: '🌠', check: () => progress.xp >= 500 },
    { id: 'xp_1000', name: '1000 XP!', icon: '💫', check: () => progress.xp >= 1000 },
  ];

  checks.forEach(({ id, name, icon, check }) => {
    if (!progress.achievements.includes(id) && check()) {
      progress.achievements.push(id);
      newAchievements.push({ id, name, icon });
    }
  });

  saveProgress(progress);
  return newAchievements;
}

export function getLevelTitle(level) {
  if (level <= 3) return { title: 'Pemula', emoji: '🌱' };
  if (level <= 6) return { title: 'Pembelajar', emoji: '📖' };
  if (level <= 10) return { title: 'Menengah', emoji: '📚' };
  if (level <= 15) return { title: 'Mahir', emoji: '🎓' };
  if (level <= 20) return { title: 'Ahli', emoji: '🏆' };
  return { title: 'Master', emoji: '👑' };
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
