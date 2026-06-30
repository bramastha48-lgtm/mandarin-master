// Stroke order validation and character comparison

// Character stroke data (simplified reference strokes for common characters)
export const strokeData = {
  '一': { strokes: 1, guide: '横 (héng) - Garis horizontal dari kiri ke kanan' },
  '二': { strokes: 2, guide: '横-横 (héng-héng) - Dua garis horizontal, atas lebih pendek' },
  '三': { strokes: 3, guide: '横-横-横 - Tiga garis horizontal' },
  '人': { strokes: 2, guide: '撇-捺 (piě-nà) - Garis miring kiri lalu kanan' },
  '大': { strokes: 3, guide: '横-撇-捺 - Horizontal lalu dua garis miring' },
  '小': { strokes: 3, guide: '竖-撇-点 - Vertikal lalu dua titik' },
  '口': { strokes: 3, guide: '竖-横折-横 - Seperti kotak' },
  '日': { strokes: 4, guide: '竖-横折-横-横 - Kotak dengan garis tengah' },
  '月': { strokes: 4, guide: '撇-横折钩-横-横 - Seperti bulan sabit' },
  '水': { strokes: 4, guide: '竖钩-横撇-撇-捺 - Vertikal dengan dua garis samping' },
  '火': { strokes: 4, guide: '点-撇-撇-捺 - Seperti api menyala' },
  '山': { strokes: 3, guide: '竖-竖折-竖 - Seperti gunung dengan tiga puncak' },
  '木': { strokes: 4, guide: '横-竖-撇-捺 - Seperti pohon' },
  '金': { strokes: 8, guide: '撇-捺-横-横-竖-横-撇-点' },
  '王': { strokes: 4, guide: '横-横-竖-横 - Tiga horizontal dengan vertikal' },
  '女': { strokes: 3, guide: '撇点-撇-横 - Seperti orang berdiri' },
  '子': { strokes: 3, guide: '横撇-弯钩-横' },
  '心': { strokes: 4, guide: '点-卧钩-点-点 - Seperti hati' },
  '中': { strokes: 4, guide: '竖-横折-横-竖 - Kotak dengan garis tengah vertikal' },
  '国': { strokes: 8, guide: '竖-横折-横-横-竖-横-点-横 - Kotak dengan玉 di dalam' },
  '好': { strokes: 6, guide: '撇点-撇-横-横撇-弯钩-横 - 女+子' },
  '我': { strokes: 7, guide: '撇-横-竖钩-提-斜钩-撇-点' },
  '你': { strokes: 7, guide: '撇-竖-撇-横钩-竖-撇-点' },
  '他': { strokes: 5, guide: '撇-竖-横折钩-竖-竖弯钩' },
  '她': { strokes: 6, guide: '撇点-撇-横-横折钩-竖-竖弯钩' },
  '的': { strokes: 8, guide: '撇-竖-横折-横-横-撇-横折钩-点' },
  '是': { strokes: 9, guide: '竖-横折-横-横-横-竖-横-撇-点' },
  '不': { strokes: 4, guide: '横-撇-竖-点' },
  '了': { strokes: 2, guide: '横撇-弯钩' },
  '在': { strokes: 6, guide: '横-撇-竖-横-竖-横' },
  '有': { strokes: 6, guide: '横-撇-竖-横折钩-横-横' },
  '这': { strokes: 7, guide: '点-横-撇-点-点-横折折撇-捺' },
  '个': { strokes: 3, guide: '撇-捺-竖' },
  '们': { strokes: 5, guide: '撇-竖-点-竖-横折钩' },
  '来': { strokes: 7, guide: '横-点-撇-横-竖-撇-捺' },
  '上': { strokes: 3, guide: '竖-横-横' },
  '到': { strokes: 8, guide: '横-撇折-点-横-竖-横-竖-竖钩' },
  '说': { strokes: 9, guide: '点-横折提-点-撇-竖-横折-横-撇-竖弯钩' },
  '会': { strokes: 6, guide: '撇-捺-横-横-撇折-点' },
  '要': { strokes: 9, guide: '横-竖-横折-竖-竖-横-撇点-撇-横' },
  '没': { strokes: 7, guide: '点-点-提-撇-横折弯-横撇-捺' },
  '就': { strokes: 12, guide: '点-横-竖-横折-横-竖钩-点-提-撇-横折弯-横撇-点' },
  '那': { strokes: 6, guide: '横折钩-横-横-撇-横撇弯钩-竖' },
  '得': { strokes: 11, guide: '撇-撇-竖-竖-横折-横-横-横-横-竖钩-点' },
  '也': { strokes: 3, guide: '横折钩-竖-竖弯钩' },
  '做': { strokes: 11, guide: '撇-竖-横-竖-竖-横折-横-撇-横撇-捺-点' },
  '看': { strokes: 9, guide: '撇-横-横-撇-点-竖-横折-横-横' },
  '想': { strokes: 13, guide: '横-竖-撇-点-撇-横折-横-横-点-斜钩-点-点-点' },
  '知': { strokes: 8, guide: '撇-横-横-撇-点-竖-横折-横' },
  '道': { strokes: 12, guide: '点-撇-横-撇-竖-横折-横-横-横-点-横折折撇-捺' },
  '过': { strokes: 6, guide: '横-竖钩-点-点-横折折撇-捺' },
  '对': { strokes: 5, guide: '横撇-点-横-竖钩-点' },
  '时': { strokes: 7, guide: '竖-横折-横-横-横-竖钩-点' },
  '后': { strokes: 6, guide: '撇-撇-横-竖-横折-横' },
  '多': { strokes: 6, guide: '撇-横撇-点-撇-横撇-点' },
  '少': { strokes: 4, guide: '竖-撇-点-撇' },
  '年': { strokes: 6, guide: '撇-横-横-竖-横-竖' },
  '天': { strokes: 4, guide: '横-横-撇-捺' },
  '地': { strokes: 6, guide: '横-竖-提-横折钩-竖-竖弯钩' },
  '生': { strokes: 5, guide: '撇-横-横-竖-横' },
  '出': { strokes: 5, guide: '竖折-竖-竖-竖折-竖' },
  '里': { strokes: 7, guide: '竖-横折-横-横-竖-横-横' },
  '都': { strokes: 10, guide: '横-竖-横-撇-竖-横折-横-横-横撇弯钩-竖' },
  '去': { strokes: 5, guide: '横-竖-横-撇折-点' },
  '还': { strokes: 7, guide: '横-撇-竖-点-点-横折折撇-捺' },
  '又': { strokes: 2, guide: '横撇-捺' },
  '只': { strokes: 5, guide: '竖-横折-横-撇-点' },
  '让': { strokes: 5, guide: '点-横折提-竖-横-横' },
  '把': { strokes: 7, guide: '横-竖钩-提-横折-竖-横-竖弯钩' },
  '用': { strokes: 5, guide: '撇-横折钩-横-横-竖' },
  '什': { strokes: 4, guide: '撇-竖-横-竖' },
  '么': { strokes: 3, guide: '撇-撇折-点' },
  '家': { strokes: 10, guide: '点-点-横撇-横-撇-弯钩-撇-撇-撇-捺' },
  '走': { strokes: 7, guide: '横-竖-横-竖-横-撇-捺' },
  '下': { strokes: 3, guide: '横-竖-点' },
  '开': { strokes: 4, guide: '横-横-撇-竖' },
  '两': { strokes: 7, guide: '横-竖-横折钩-撇-点-撇-点' },
  '些': { strokes: 8, guide: '竖-横-竖-横-撇-竖弯钩-横-横' },
  '见': { strokes: 4, guide: '竖-横折-撇-竖弯钩' },
  '从': { strokes: 4, guide: '撇-点-撇-捺' },
  '而': { strokes: 6, guide: '横-撇-竖-横折钩-竖-竖' },
  '它': { strokes: 5, guide: '点-点-横撇-撇-竖弯钩' },
  '与': { strokes: 3, guide: '横-竖折折钩-横' },
  '长': { strokes: 4, guide: '撇-横-竖钩-捺' },
};

export function getStrokeGuide(character) {
  return strokeData[character] || null;
}

export function validateStrokeCount(character, drawnStrokes) {
  const data = strokeData[character];
  if (!data) return { valid: null, message: 'Data goresan tidak tersedia untuk karakter ini' };

  if (drawnStrokes === data.strokes) {
    return { valid: true, message: `✅ Benar! ${character} memiliki ${data.strokes} goresan` };
  } else if (drawnStrokes < data.strokes) {
    return { valid: false, message: `❌ Kurang ${data.strokes - drawnStrokes} goresan. ${character} memiliki ${data.strokes} goresan` };
  } else {
    return { valid: false, message: `❌ Kelebihan ${drawnStrokes - data.strokes} goresan. ${character} memiliki ${data.strokes} goresan` };
  }
}

// Simple canvas-based stroke counting (tracks separate line segments)
export class StrokeCounter {
  constructor() {
    this.strokes = 0;
    this.isDrawing = false;
  }

  startStroke() {
    this.isDrawing = true;
  }

  endStroke() {
    if (this.isDrawing) {
      this.strokes++;
      this.isDrawing = false;
    }
    return this.strokes;
  }

  reset() {
    this.strokes = 0;
    this.isDrawing = false;
  }

  getCount() {
    return this.strokes;
  }
}

// Compare two character images (simplified - checks ink coverage)
export function compareCharacters(originalCanvas, userCanvas) {
  const origCtx = originalCanvas.getContext('2d');
  const userCtx = userCanvas.getContext('2d');

  const origData = origCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height).data;
  const userData = userCtx.getImageData(0, 0, userCanvas.width, userCanvas.height).data;

  let origInk = 0;
  let userInk = 0;
  let overlap = 0;

  for (let i = 3; i < origData.length; i += 4) {
    const origPixel = origData[i] > 50;
    const userPixel = userData[i] > 50;

    if (origPixel) origInk++;
    if (userPixel) userInk++;
    if (origPixel && userPixel) overlap++;
  }

  if (origInk === 0 || userInk === 0) return 0;

  // Calculate similarity based on overlap
  const precision = overlap / userInk; // How much of user's stroke is on target
  const recall = overlap / origInk; // How much of target is covered
  const f1 = 2 * (precision * recall) / (precision + recall + 0.001);

  return Math.round(f1 * 100);
}
