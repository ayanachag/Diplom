import { useState } from 'react'
import './StatsScreen.css'

const GOAL = 2000

const periods = [
  { id: 'day', label: 'День' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
] as const

type Period = (typeof periods)[number]['id']

const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

function glassesLabel(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? 'стакан'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'стакана'
        : 'стаканов'
  return `выпито ${word}`
}

function grouped(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function periodStats(period: Period, consumed: number) {
  const today = new Date()
  const dayTotal = consumed
  const weekTotal = consumed * 7
  const monthTotal = consumed * 23

  if (period === 'week') {
    return {
      caption: 'Эта неделя',
      total: weekTotal,
      goal: GOAL * 7,
      glasses: Math.max(0, Math.round(weekTotal / 250)),
      amountCaption: 'выпито за неделю',
      streak: 7,
      yLabels: ['2 000', '1 000', '0'],
      bars: [
        { label: 'Пн', height: 62 },
        { label: 'Вт', height: 78 },
        { label: 'Ср', height: 48 },
        { label: 'Чт', height: 100 },
        { label: 'Пт', height: 70 },
        { label: 'Сб', height: 88 },
        { label: 'Вс', height: 56 },
      ],
    }
  }

  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]
  if (period === 'month') {
    return {
      caption: `${monthNames[today.getMonth()]} ${today.getFullYear()}`,
      total: monthTotal,
      goal: GOAL * 30,
      glasses: Math.max(0, Math.round(monthTotal / 250)),
      amountCaption: 'выпито за месяц',
      streak: 12,
      yLabels: ['8 000', '4 000', '0'],
      bars: [
        { label: '1', height: 42 },
        { label: '8', height: 68 },
        { label: '15', height: 100 },
        { label: '22', height: 74 },
        { label: '29', height: 81 },
      ],
    }
  }

  return {
    caption: `Сегодня, ${today.getDate()} ${months[today.getMonth()]}`,
    total: dayTotal,
    goal: GOAL,
    glasses: Math.max(0, Math.round(dayTotal / 250)),
    amountCaption: 'выпито сегодня',
    streak: 7,
    yLabels: ['750', '500', '250', '0'],
    bars: [
      { label: '8:00', height: 32 },
      { label: '10:00', height: 55 },
      { label: '12:00', height: 70 },
      { label: '14:00', height: 100 },
      { label: '16:00', height: 48 },
      { label: '18:00', height: 34 },
      { label: '20:00', height: 46 },
    ],
  }
}

export default function StatsScreen({ consumed }: { consumed: number }) {
  const [period, setPeriod] = useState<Period>('day')
  const view = periodStats(period, consumed)
  const remaining = Math.max(0, view.goal - view.total)
  const percent = Math.min(100, Math.round((view.total / view.goal) * 100))
  const dayTotal = consumed
  const weekTotal = consumed * 7
  const monthTotal = consumed * 23

  return (
    <div className="stats">
      <div className="stats-header">
        <div>
          <h1>Статистика</h1>
          <p>Следите за своим прогрессом</p>
        </div>
        <button type="button" className="stats-calendar" aria-label="Календарь">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect x="2" y="4" width="18" height="16" rx="3" fill="none" stroke="#4aa4e8" strokeWidth="1.8" />
            <path d="M2 9h18M7 2v4M15 2v4" stroke="#4aa4e8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <PeriodSwitch period={period} onChange={setPeriod} />

      <section className="stats-hero">
        <div className="stats-ring" aria-hidden="true">
          <svg width="148" height="148" viewBox="0 0 148 148">
            <circle cx="74" cy="74" r="62" fill="none" stroke="#e3f1fb" strokeWidth="12" />
            {percent > 0 && (
              <circle
                cx="74"
                cy="74"
                r="62"
                fill="none"
                stroke="#2aaaf8"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 62}
                strokeDashoffset={2 * Math.PI * 62 * (1 - percent / 100)}
                transform="rotate(-90 74 74)"
              />
            )}
          </svg>
          <svg className="stats-drop" viewBox="0 0 88 112" aria-hidden="true">
            <path
              d="M44 4C44 4 12 48 12 72C12 93.5 26.4 108 44 108C61.6 108 76 93.5 76 72C76 48 44 4 44 4Z"
              fill="#2aaaf8"
            />
            <ellipse cx="32" cy="62" rx="7" ry="14" fill="#ffffff" opacity="0.35" transform="rotate(-18 32 62)" />
          </svg>
        </div>
        <div className="stats-hero-copy">
          <p className="stats-caption">{view.caption}</p>
          <p className="stats-total">
            {grouped(view.total)} <span>/ {grouped(view.goal)} мл</span>
          </p>
          <div className="stats-left">
            <svg width="16" height="22" viewBox="0 0 16 24.8" aria-hidden="true">
              <path d="M8 0C2.2 7.5 0 12.2 0 16.2 0 20.6 3.6 24.8 8 24.8S16 20.6 16 16.2C16 12.2 13.8 7.5 8 0Z" fill="#5eb6f5" />
            </svg>
            <div>
              <p>Осталось</p>
              <strong>{grouped(remaining)} мл</strong>
              <span>до цели</span>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-metrics">
        <article>
          <GlassIcon />
          <strong>{view.glasses}</strong>
          <span>{glassesLabel(view.glasses)}</span>
        </article>
        <article>
          <BottleIcon />
          <strong>{grouped(view.total)}</strong>
          <span>{view.amountCaption}</span>
        </article>
        <article>
          <CrownIcon />
          <strong>{percent}%</strong>
          <span>выполнено цели</span>
        </article>
        <article>
          <CalIcon />
          <strong>{view.streak}</strong>
          <span>дней подряд</span>
        </article>
      </div>

      <section className="stats-panel">
        <div className="stats-panel-head">
          <h2>Динамика потребления</h2>
          <PeriodSwitch period={period} onChange={setPeriod} compact />
        </div>
        <div className="stats-plot">
          <div className="stats-yaxis">
            {view.yLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="stats-bars">
            {view.bars.map((bar) => (
              <div key={bar.label} className="stats-col">
                <div className="stats-bar-track">
                  <span style={{ height: `${bar.height}%` }} />
                </div>
                <em>{bar.label}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-panel">
        <h2>Сравнение периодов</h2>
        <div className="stats-compare">
          <article className={period === 'day' ? 'is-current' : ''}>
            <DropMini />
            <p>День</p>
            <strong>{grouped(dayTotal)} мл</strong>
            <span className="stats-up">+12%</span>
            <small>чем вчера</small>
          </article>
          <article className={period === 'week' ? 'is-current' : ''}>
            <BarsMini />
            <p>Неделя</p>
            <strong>{grouped(weekTotal)} мл</strong>
            <span className="stats-up">+8%</span>
            <small>чем прошлую неделю</small>
          </article>
          <article className={period === 'month' ? 'is-current' : ''}>
            <CalIcon />
            <p>Месяц</p>
            <strong>{grouped(monthTotal)} мл</strong>
            <span className="stats-up">+15%</span>
            <small>чем прошлый месяц</small>
          </article>
        </div>
      </section>

      <button type="button" className="stats-banner">
        <TargetIcon />
        <span>
          <strong>Вы на пути к цели!</strong>
          Продолжайте пить воду регулярно, чтобы чувствовать себя лучше.
        </span>
        <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true">
          <path d="M1 1l6 6-6 6" fill="none" stroke="#8aa4c0" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function PeriodSwitch({
  period,
  onChange,
  compact = false,
}: {
  period: Period
  onChange: (period: Period) => void
  compact?: boolean
}) {
  return (
    <div className={compact ? 'stats-switch stats-switch-compact' : 'stats-switch'} role="tablist" aria-label="Период">
      {periods.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={period === item.id}
          className={period === item.id ? 'is-selected' : ''}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function GlassIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden="true">
      <path d="M3 1h12l-1.2 16.2A4 4 0 0 1 9.8 21H8.2a4 4 0 0 1-4-3.8L3 1Z" fill="#d7efff" stroke="#5eb6f5" strokeWidth="1.4" />
      <path d="M4 8h10" stroke="#5eb6f5" strokeWidth="1.4" />
    </svg>
  )
}

function BottleIcon() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
      <rect x="4" y="1" width="6" height="4" rx="1" fill="#0b4e93" />
      <rect x="2" y="6" width="10" height="15" rx="3" fill="#d7efff" stroke="#5eb6f5" strokeWidth="1.4" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
      <path d="M1 13 4 4l7 6 7-6 3 9H1Z" fill="#7ec8fb" />
      <path d="M2 15h18" stroke="#4aa4e8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1.5" y="3" width="15" height="13.5" rx="2" fill="none" stroke="#5eb6f5" strokeWidth="1.5" />
      <path d="M1.5 7.5h15M6 1.5v3M12 1.5v3" stroke="#5eb6f5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function DropMini() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true">
      <path d="M7 0C2 6 0 9.2 0 12.2 0 15.4 3.1 18 7 18s7-2.6 7-5.8C14 9.2 12 6 7 0Z" fill="#5eb6f5" />
    </svg>
  )
}

function BarsMini() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true">
      <path d="M2 16V8M9 16V3M16 16V6" stroke="#5eb6f5" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="11" fill="none" stroke="#5eb6f5" strokeWidth="2" />
      <circle cx="14" cy="14" r="6" fill="none" stroke="#5eb6f5" strokeWidth="2" />
      <circle cx="14" cy="14" r="2.2" fill="#2aaaf8" />
    </svg>
  )
}
