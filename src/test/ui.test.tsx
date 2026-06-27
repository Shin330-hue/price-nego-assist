import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import type { DataQuality, OfficialCostIndicator } from '../types/domain'
import { METAL_FIELDS } from '../data/fields'
import { getFieldById, getRelatedIndicators } from '../lib/data-loader'
import { HERO_HEADLINE } from '../lib/copy'
import { DataQualityBanner } from '../components/data/DataQualityBanner'

// Recharts は jsdom（レイアウト無し）で幅0になるためスタブ化する。
vi.mock('recharts', () => {
  const Stub = ({ children }: { children?: ReactNode }) => <div>{children}</div>
  return {
    ResponsiveContainer: Stub,
    LineChart: Stub,
    Line: Stub,
    XAxis: Stub,
    YAxis: Stub,
    CartesianGrid: Stub,
    Tooltip: Stub,
    ReferenceLine: Stub,
  }
})

const baseIndicator: OfficialCostIndicator = {
  id: 'x',
  category: 'material',
  name: 'テスト指標',
  description: '',
  publisher: 'p',
  sourceName: 's',
  sourceUrl: 'https://example.com',
  seriesName: 'sn',
  unit: 'u',
  frequency: 'monthly',
  publishedAt: '2026-01-01',
  retrievedAt: '2026-01-01',
  quality: 'official_manual',
  calculationNote: '',
  negotiationUse: '',
  values: [{ period: '2026-01', value: 1 }],
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('ヒーロー見出しと 8 分野が表示される', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: HERO_HEADLINE })).toBeInTheDocument()
    for (const field of METAL_FIELDS) {
      expect(screen.getByText(field.name)).toBeInTheDocument()
    }
  })
})

describe('FieldPage', () => {
  it('指標・取適法ポイント・依頼文を表示し、出典バッジが実 quality を反映する', async () => {
    renderAt('/fields/cutting')

    expect(await screen.findByRole('heading', { level: 1, name: '切削加工' })).toBeInTheDocument()
    // 切削は分野固有の品目（工具鋼）を表示する（分野間の差別化）
    expect(screen.getByText('工具鋼 企業物価指数')).toBeInTheDocument()
    expect(screen.getByText('買いたたきの禁止')).toBeInTheDocument()
    expect(screen.getByText(/価格協議のお願い/)).toBeInTheDocument()

    // 各データに控えめな出典リンクがある（要件 13.3）
    expect(document.querySelector('a[href*="boj.or.jp"]')).toBeTruthy()
    // 出典特定のための系列コードを表示（工具鋼 = PRCG20_2200950007）
    expect(screen.getAllByText(/PRCG20_2200950007/).length).toBeGreaterThan(0)
    // 原データ（特定系列）への直接リンクがある
    expect(document.querySelector('a[href*="getDataCode"]')).toBeTruthy()
    // 進め方・依頼文は「参考」として表示（要件 13.2）
    expect(screen.getByText(/一般的な流れの参考/)).toBeInTheDocument()
    expect(screen.getByText(/文面づくりの参考用テンプレート/)).toBeInTheDocument()

    // 各指標の SourceBadge は「指標カード」と「出典概要」の2箇所に出る。
    // 監査で見つかった major（sample を official と誤表示）の回帰防止として、
    // 表示される品質ラベル数が実データの quality と一致することを検証する。
    const inds = getRelatedIndicators(getFieldById('cutting')!)
    const times2 = (q: DataQuality) => inds.filter((i) => i.quality === q).length * 2
    expect(screen.queryAllByText('サンプルデータ')).toHaveLength(times2('sample'))
    expect(screen.queryAllByText('公式（手動更新）')).toHaveLength(times2('official_manual'))
    expect(screen.queryAllByText('公式確認済み')).toHaveLength(times2('official_verified'))

    // サンプル/deprecated があるときだけデータ品質警告バナーが出る。
    const hasWarn = inds.some((i) => i.quality === 'sample' || i.quality === 'deprecated')
    const banner = screen.queryByText(/開発用サンプルデータ|更新が停止/)
    if (hasWarn) {
      expect(banner).toBeInTheDocument()
    } else {
      expect(banner).not.toBeInTheDocument()
    }
  })

  it('不正な fieldId では NotFound 相当を表示する', async () => {
    renderAt('/fields/unknown-field')
    expect(await screen.findByText('存在しない加工分野です')).toBeInTheDocument()
  })
})

describe('DataQualityBanner', () => {
  it('sample を含むと警告を表示する', () => {
    render(<DataQualityBanner indicators={[{ ...baseIndicator, quality: 'sample' }]} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/開発用サンプルデータ/)).toBeInTheDocument()
  })

  it('すべて official なら何も表示しない', () => {
    const { container } = render(
      <DataQualityBanner indicators={[{ ...baseIndicator, quality: 'official_manual' }]} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})

describe('未定義パス', () => {
  it('NotFound を表示する', () => {
    renderAt('/no-such-page')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
