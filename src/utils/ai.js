// AI Tutor utility using Groq API

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Sanitize API key - remove non-ASCII characters that cause fetch errors
function cleanApiKey(key) {
  return (key || '').replace(/[^\x00-\x7F]/g, '');
}

async function groqFetch(apiKey, body) {
  const cleanKey = cleanApiKey(apiKey);
  if (!cleanKey) {
    throw new Error('API key tidak valid. Silakan masukkan API key Groq di pengaturan (⚙️).');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cleanKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export async function chatWithTutor(message, apiKey, conversationHistory = []) {
  const systemPrompt = `Kamu adalah AI tutor bahasa Mandarin yang ramah dan sabar. Kamu berbicara dalam bahasa Indonesia dan mengajar bahasa Mandarin.

Aturan:
1. Jelaskan konsep bahasa Mandarin dengan jelas dan sederhana
2. Berikan contoh kalimat dengan pinyin dan terjemahan
3. Koreksi kesalahan siswa dengan lembut
4. Dorong siswa untuk terus belajar
5. Jika siswa bertanya kosakata, berikan: karakter, pinyin, arti, dan contoh kalimat
6. Gunakan bahasa Indonesia yang kasual tapi edukatif
7. Sesekali gunakan emoji untuk membuat percakapan lebih menyenangkan
8. Jika ditanya grammar, jelaskan dengan pola yang mudah diikuti
9. Berikan tips belajar yang praktis
10. Gunakan Bahasa Indonesia, bukan Bahasa Inggris`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  try {
    const data = await groqFetch(apiKey, {
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });
    return data.choices[0]?.message?.content || 'Maaf, aku tidak bisa menjawab sekarang.';
  } catch (error) {
    console.error('AI Tutor Error:', error);
    throw error;
  }
}

export async function generateQuizQuestions(topic, hskLevel, apiKey) {
  const prompt = `Buatkan 5 soal kuis bahasa Mandarin tentang "${topic}" untuk level HSK ${hskLevel}.
Format JSON array:
[
  {
    "question": "pertanyaan",
    "options": ["A", "B", "C", "D"],
    "answer": 0 (index jawaban benar),
    "explanation": "penjelasan"
  }
]
Hanya kembalikan JSON, tanpa markdown atau penjelasan lain.`;

  try {
    const data = await groqFetch(apiKey, {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Kamu adalah pembuat soal bahasa Mandarin. Output hanya JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    const content = data.choices[0]?.message?.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return null;
  }
}

export async function getWordExplanation(word, apiKey) {
  const prompt = `Jelaskan kata bahasa Mandarin "${word}" secara lengkap:
1. Karakter dan pinyin
2. Arti dalam bahasa Indonesia
3. Penggunaan dalam kalimat (2-3 contoh dengan terjemahan)
4. Tips mengingat kata ini
5. Kata terkait (sinonim atau kata yang sering muncul bersama)

Gunakan bahasa Indonesia yang ramah dan mudah dipahami.`;

  try {
    const data = await groqFetch(apiKey, {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Kamu adalah tutor bahasa Mandarin yang ahli. Jawab dalam bahasa Indonesia.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 512,
    });
    return data.choices[0]?.message?.content || 'Tidak ada penjelasan tersedia.';
  } catch (error) {
    console.error('Word explanation error:', error);
    throw error;
  }
}
