// OGP 画像（1200x630 PNG）を生成する。
// ブランド配色（鉄黒＋溶接オレンジ）の上昇トレンド線モチーフ。
// テキスト/ロゴの作り込みは人手デザインの後工程（docs に記載）。
//   node scripts/generate-ogp.mjs
import zlib from 'node:zlib'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const W = 1200
const H = 630
const bg = [17, 19, 24] // #111318
const surface = [32, 38, 49] // #202631
const orange = [245, 158, 11] // #f59e0b

const px = Buffer.alloc(W * H * 3)
const set = (x, y, c) => {
  if (x < 0 || x >= W || y < 0 || y >= H) return
  const i = (y * W + x) * 3
  px[i] = c[0]
  px[i + 1] = c[1]
  px[i + 2] = c[2]
}

for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) set(x, y, bg)
// 下部のアクセントバー
for (let y = H - 8; y < H; y++) for (let x = 0; x < W; x++) set(x, y, orange)
// 左の太いライン
for (let y = 90; y < H - 90; y++) for (let x = 80; x < 86; x++) set(x, y, surface)

const line = (x0, y0, x1, y1, c, thick) => {
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx - dy
  let x = x0
  let y = y0
  for (;;) {
    for (let t = -thick; t <= thick; t++) {
      set(x, y + t, c)
      set(x + t, y, c)
    }
    if (x === x1 && y === y1) break
    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x += sx
    }
    if (e2 < dx) {
      err += dx
      y += sy
    }
  }
}

const pts = [
  [140, 470],
  [340, 430],
  [540, 310],
  [760, 350],
  [980, 180],
  [1080, 150],
]
for (let i = 0; i < pts.length - 1; i++) {
  const a = pts[i]
  const b = pts[i + 1]
  line(a[0], a[1], b[0], b[1], orange, 3)
}

const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const t = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([t, data])) >>> 0)
  return Buffer.concat([len, t, data, crc])
}

const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 2 // color type RGB
const raw = Buffer.alloc(H * (W * 3 + 1))
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0 // filter: none
  px.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, y * W * 3 + W * 3)
}
const idat = zlib.deflateSync(raw)
const png = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
fs.writeFileSync(join(outDir, 'ogp.png'), png)
console.log(`ogp.png written: ${png.length} bytes`)
