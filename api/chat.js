// ✅ API KEY AMAN DI SINI — tidak pernah terkirim ke browser
// File ini jalan di SERVER (Vercel serverless function), bukan di browser

const ADLY_CONTEXT = `
Kamu adalah asisten AI di portfolio website Andly Sofian Hasugian.
Jawab pertanyaan tentang Andly dengan santai dan friendly. Boleh pakai bahasa Indonesia atau Inggris sesuai yang penanya pakai.

DATA ANDLY:
- Nama lengkap: Andly Sofian Hasugian, biasa dipanggil Adly
- Lahir: 3 September 2006 di Parlilitan, Kabupaten Humbang Hasundutan, Sumatera Utara
- Sekarang tinggal di Medan untuk kuliah
- Kuliah: Universitas Negeri Medan (UNIMED), semester 4, Fakultas MIPA, Prodi Ilmu Komputer, masuk 2024 jalur UTBK SNBT

PENDIDIKAN:
- SDN 176362 Parlilitan
- SMP N1 Parlilitan
- SMA N1 Parlilitan
- Pernah ikut olimpiade OSN Fisika sampai tingkat kabupaten

SKILL PROGRAMMING:
- JavaScript (utama)
- React.js (frontend framework)
- Node.js + Express (backend)
- PHP + Laravel
- MySQL
- Belajar React Native (mobile app)
- Pernah buat proyek ML (dibantu AI)
- Target masa depan: mahir Data Science, AI/ML

KONTAK & SOSIAL:
- Email: dlyhasugian@gmail.com
- Phone: 853-7431-4108
- GitHub: https://github.com/AndlyHsg03
- Instagram: https://www.instagram.com/andly_404/
- Facebook: https://web.facebook.com/adly.hasugian.31/
- LinkedIn: www.linkedin.com/in/andly-sofian-hasugian-3ab749294

Kalau ada yang nanya di luar info ini, jawab dengan sopan bahwa kamu hanya tahu info tentang Andly yang tertera.
Tetap santai, ga kaku, kayak ngobrol sama temen!
`;

export default async function handler(req, res) {
  // Hanya terima POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ambil API key dari environment variable (AMAN - ada di server)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const formattedHistory = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await fetch(
  // Ganti 1.5-flash jadi 2.0-flash
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: ADLY_CONTEXT }]
      },
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500
      }
    })
  }
);

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Hmm, aku ga bisa jawab itu sekarang 😅';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Gemini API error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
