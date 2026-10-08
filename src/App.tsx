import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import StatsScreen from './StatsScreen'
import './App.css'
import statusSignal from './assets/water/status-signal.svg'
import statusWifi from './assets/water/status-wifi.svg'
import statusBattery from './assets/water/status-battery.svg'
import settingsIcon from './assets/water/settings.svg'
import dropPraise from './assets/water/drop-praise.svg'
import dropRemain from './assets/water/drop-remain.svg'
import divider from './assets/water/divider.svg'
import actionBg from './assets/water/action-bg.svg'
import glass250 from './assets/water/glass-250.svg'
import glass500 from './assets/water/glass-500.svg'
import bottle750 from './assets/water/bottle-750.svg'
import dots from './assets/water/dots.svg'
import chartLine from './assets/water/chart-line.svg'
import chartLineSoft from './assets/water/chart-line-soft.svg'
import bar1 from './assets/water/bar-1.svg'
import bar2 from './assets/water/bar-2.svg'
import bar3 from './assets/water/bar-3.svg'
import bar4 from './assets/water/bar-4.svg'
import bar5 from './assets/water/bar-5.svg'
import bar6 from './assets/water/bar-6.svg'
import bar7 from './assets/water/bar-7.svg'
import dropTip from './assets/water/drop-tip.svg'
import chevron from './assets/water/chevron.svg'
import navBg from './assets/water/nav-bg.svg'
import navTrophy from './assets/water/nav-trophy.svg'
import navProfile from './assets/water/nav-profile.svg'

const GOAL = 2000
const CONFETTI_COLORS = ['#2AAAF8', '#31A9F7', '#79CCFA', '#168eea', '#0B4E93', '#CDEEFF', '#35ADF6', '#102653', '#E3F1FB', '#ffffff']

function makeConfetti() {
  return Array.from({ length: 56 }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.45,
    duration: 2.6 + Math.random() * 1.6,
    size: 9 + Math.random() * 11,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    drift: -36 + Math.random() * 72,
    round: index % 4 === 0,
  }))
}
const RING_RADIUS = 112
const RING_LENGTH = 2 * Math.PI * RING_RADIUS
const WATER_TOP = 29
const WATER_BOTTOM = 137
const WATER_SPAN = WATER_BOTTOM - WATER_TOP

const actions = [
  { amount: 250, label: '+ 250 мл', icon: glass250, alt: 'Стакан 250 миллилитров' },
  { amount: 500, label: '+ 500 мл', icon: glass500, alt: 'Стакан 500 миллилитров' },
  { amount: 750, label: '+ 750 мл', icon: bottle750, alt: 'Бутылка 750 миллилитров' },
] as const

const bars = [
  { src: bar1, label: '8:00', left: 49, top: 123 },
  { src: bar2, label: '10:00', left: 91, top: 133 },
  { src: bar3, label: '12:00', left: 133, top: 123 },
  { src: bar4, label: '14:00', left: 175, top: 111 },
  { src: bar5, label: '16:00', left: 218, top: 126 },
  { src: bar6, label: '18:00', left: 260, top: 133 },
  { src: bar7, label: '20:00', left: 302, top: 142 },
] as const

const periods = [
  { id: 'day', label: 'День' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
] as const

type Period = (typeof periods)[number]['id']

function grouped(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function pressAction(event: MouseEvent<HTMLButtonElement>) {
  const button = event.currentTarget
  button.classList.remove('is-pressed')
  void button.offsetWidth
  button.classList.add('is-pressed')
}

function WaterBottle({ percent }: { percent: number }) {
  const waterHeight = (WATER_SPAN * percent) / 100
  const waterY = WATER_BOTTOM - waterHeight

  return (
    <svg
      className="bottle"
      width="67.1888"
      height="143"
      viewBox="0 0 67.1888 143"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="bottle-inner">
          <rect x="6" y="29" width="50" height="108" rx="14" />
        </clipPath>
        <clipPath id="water-line">
          <rect className="bottle-water" x="0" y={waterY} width="70" height={waterHeight} />
        </clipPath>
      </defs>
      <path
        d="M43 25H19C9.61116 25 2 32.6112 2 42V124C2 133.389 9.61116 141 19 141H43C52.3888 141 60 133.389 60 124V42C60 32.6112 52.3888 25 43 25Z"
        fill="#CDEEFF"
      />
      <g clipPath="url(#bottle-inner)">
        <rect className="bottle-water" x="6" y={waterY} width="50" height={waterHeight} fill="#35ADF6" opacity="0.8" />
        <g clipPath="url(#water-line)">
          <circle className="bubble bubble-a" cx="25" cy="108" r="3.5" fill="#E8F7FF" />
          <circle className="bubble bubble-b" cx="39" cy="118" r="4" fill="#79CCFA" />
          <circle className="bubble bubble-c" cx="22" cy="126" r="2.4" fill="#CDEEFF" />
          <circle className="bubble bubble-d" cx="33" cy="122" r="1.8" fill="#ffffff" opacity="0.85" />
        </g>
      </g>
      <path
        d="M43 25H19C9.61116 25 2 32.6112 2 42V124C2 133.389 9.61116 141 19 141H43C52.3888 141 60 133.389 60 124V42C60 32.6112 52.3888 25 43 25Z"
        fill="none"
        stroke="#55BDF4"
        strokeWidth="4"
      />
      <path
        d="M44 5H18C15.7909 5 14 6.79086 14 9V24C14 26.2091 15.7909 28 18 28H44C46.2091 28 48 26.2091 48 24V9C48 6.79086 46.2091 5 44 5Z"
        fill="#0B4E93"
      />
      <path
        d="M42 0H20C18.8954 0 18 0.89543 18 2V6C18 7.10457 18.8954 8 20 8H42C43.1046 8 44 7.10457 44 6V2C44 0.89543 43.1046 0 42 0Z"
        fill="#143C73"
      />
      <path
        d="M47.9984 16C60.665 24 66.3317 36.3333 64.9984 53C63.665 64.3333 59.9984 66 53.9984 58C49.3317 51.3333 46.6662 29.1667 47.9996 16.5"
        stroke="#123B77"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

type Screen = 'water' | 'stats'

function screenFromLocation(): Screen {
  return window.location.pathname.replace(/\/+$/, '').endsWith('/stats') ? 'stats' : 'water'
}

function screenUrl(screen: Screen) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  return screen === 'stats' ? `${base}stats` : base
}

export default function App() {
  const [consumed, setConsumed] = useState(1000)
  const [period, setPeriod] = useState<Period>('day')
  const [customOpen, setCustomOpen] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [pulseId, setPulseId] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const [, setPortionTick] = useState(0)
  const consumedRef = useRef(1000)
  const portionsRef = useRef<number[]>([])
  const [screen, setScreen] = useState<Screen>(screenFromLocation)
  const confetti = useMemo(() => (celebrate ? makeConfetti() : []), [celebrate])

  useEffect(() => {
    const onPop = () => setScreen(screenFromLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function openScreen(next: Screen) {
    const url = screenUrl(next)
    if (window.location.pathname !== url) window.history.pushState({}, '', url)
    setScreen(next)
  }

  useEffect(() => {
    if (!celebrate) return
    const timer = window.setTimeout(() => setCelebrate(false), 4300)
    return () => window.clearTimeout(timer)
  }, [celebrate])

  const remaining = Math.max(GOAL - consumed, 0)
  const percent = Math.min(100, Math.round((consumed / GOAL) * 100))
  const praise =
    percent >= 100
      ? { title: 'Готово!', text: 'Цель на сегодня выполнена!' }
      : percent >= 50
        ? { title: 'Отлично!', text: 'Вы на пути к цели!' }
        : { title: 'Продолжайте!', text: 'Вы на пути к цели!' }

  function addWater(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) return
    const added = Math.round(amount)
    const current = consumedRef.current
    const next = Math.min(9999, current + added)
    const actual = next - current
    if (actual <= 0) return
    consumedRef.current = next
    portionsRef.current = [...portionsRef.current, actual]
    if (current < GOAL && next >= GOAL) setCelebrate(true)
    setConsumed(next)
    setPortionTick((value) => value + 1)
    setPulseId((value) => value + 1)
  }

  function removeWater() {
    const items = portionsRef.current
    const last = items.length > 0 ? items[items.length - 1] : 250
    if (items.length > 0) portionsRef.current = items.slice(0, -1)
    const next = Math.max(0, consumedRef.current - last)
    consumedRef.current = next
    setConsumed(next)
    setPortionTick((value) => value + 1)
  }

  function submitCustom(event: FormEvent) {
    event.preventDefault()
    addWater(Number(customValue))
    setCustomValue('')
    setCustomOpen(false)
  }

  return (
    <main className="stage">
      <section className="phone" aria-label={screen === 'stats' ? 'Статистика' : 'Трекер воды'}>
        <header className="status">
          <time dateTime="09:41">9:41</time>
          <div className="status-icons" aria-hidden="true">
            <img src={statusSignal} alt="" />
            <img src={statusWifi} alt="" />
            <img src={statusBattery} alt="" />
          </div>
        </header>

        <div className="screen-body">
          {screen === 'stats' ? (
            <StatsScreen consumed={consumed} />
          ) : (
            <>
        <div className="header">
          <div>
            <h1>Вода</h1>
            <p>Забота о себе каждый день</p>
          </div>
          <button type="button" className="icon-button" aria-label="Настройки">
            <img src={settingsIcon} alt="" />
          </button>
        </div>

        <div className="hero">
          <div className="ring">
            <svg className="progress-ring" width="242" height="242" viewBox="0 0 242 242" aria-hidden="true">
              <circle cx="121" cy="121" r={RING_RADIUS} fill="none" stroke="#E3F1FB" strokeWidth="18" />
              {percent > 0 && (
                <circle
                  className="ring-progress"
                  cx="121"
                  cy="121"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#2AAAF8"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={RING_LENGTH}
                  strokeDashoffset={RING_LENGTH * (1 - percent / 100)}
                  transform="rotate(-90 121 121)"
                />
              )}
            </svg>
            <WaterBottle percent={percent} />
          </div>

          <p className="amount">
            <span>{grouped(consumed)} / </span>
            <em>{grouped(GOAL)} мл</em>
          </p>

          <div className="cards">
            <article
              key={pulseId}
              className={pulseId > 0 ? 'card card-praise is-pulsing' : 'card card-praise'}
            >
              <img src={dropPraise} alt="" />
              <p className="praise-title">{praise.title}</p>
              <p className="praise-text">{praise.text}</p>
            </article>

            <article className="card card-remain">
              <button
                type="button"
                className="undo-water"
                aria-label={portionsRef.current.length > 0 ? 'Отменить последнюю порцию' : 'Убавить 250 миллилитров'}
                disabled={consumed === 0}
                onClick={(event) => {
                  pressAction(event)
                  removeWater()
                }}
              >
                −
              </button>
              <img src={dropRemain} alt="" />
              <p className="remain-label">Осталось</p>
              <p className="remain-value">{remaining} мл</p>
              <img className="remain-divider" src={divider} alt="" />
              <p className="percent">{percent} %</p>
              <p className="percent-label">выполнено</p>
              <div
                className="remain-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Выполнено"
              >
                <span className="remain-bar-fill" style={{ width: `${percent}%` }} />
              </div>
            </article>
          </div>
        </div>

        <div className="actions">
          {actions.map((action) => (
            <button
              key={action.amount}
              type="button"
              className="action"
              onClick={(event) => {
                pressAction(event)
                addWater(action.amount)
              }}
            >
              <img src={actionBg} alt="" />
              <span className="action-body">
                <img src={action.icon} alt="" />
                <span>{action.label}</span>
              </span>
            </button>
          ))}
          <button
            type="button"
            className="action"
            onClick={(event) => {
              pressAction(event)
              setCustomOpen(true)
            }}
          >
            <img src={actionBg} alt="" />
            <span className="action-body">
              <img src={dots} alt="" />
              <span>Другое</span>
            </span>
          </button>
        </div>

        {customOpen && (
          <form className="custom" onSubmit={submitCustom}>
            <label htmlFor="custom-ml">Сколько миллилитров добавить?</label>
            <input
              id="custom-ml"
              inputMode="numeric"
              value={customValue}
              onChange={(event) => setCustomValue(event.target.value)}
              placeholder="мл"
            />
            <div className="custom-buttons">
              <button type="button" onClick={() => setCustomOpen(false)}>
                Отмена
              </button>
              <button type="submit">Добавить</button>
            </div>
          </form>
        )}

        <section className="chart-card" aria-label="Динамика потребления">
          <div className="chart">
            <h2>Динамика потребления</h2>
            <div className="periods" role="tablist" aria-label="Период">
              {periods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={period === item.id}
                  className={period === item.id ? 'period period-active' : 'period'}
                  onClick={() => setPeriod(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <img className="line line-top" src={chartLine} alt="" />
            <span className="y-label y-top">2 000</span>
            <img className="line line-mid" src={chartLineSoft} alt="" />
            <span className="y-label y-mid">1 000</span>
            <img className="line line-base" src={chartLineSoft} alt="" />
            <span className="y-label y-base">0</span>
            {bars.map((item) => (
              <img
                key={item.label}
                className="bar"
                src={item.src}
                alt=""
                style={{ left: item.left, top: item.top }}
              />
            ))}
            {bars.map((item) => (
              <span key={`${item.label}-label`} className="x-label" style={{ left: item.left - 5 }}>
                {item.label}
              </span>
            ))}
            <p className="goal-pill">Цель: {grouped(GOAL)} мл</p>
          </div>
        </section>

        <button type="button" className="tip">
          <img src={dropTip} alt="" />
          <span>Пейте воду — сохраняйте энергию!</span>
          <img src={chevron} alt="" />
        </button>
            </>
          )}
        </div>

        <nav className="nav" aria-label="Разделы">
          <img className="nav-bg" src={navBg} alt="" />
          <div className="nav-items">
            <button
              type="button"
              className={screen === 'water' ? 'nav-item nav-item-active' : 'nav-item'}
              aria-current={screen === 'water' ? 'page' : undefined}
              onClick={() => openScreen('water')}
            >
              <svg className="nav-mark" width="16" height="26" viewBox="0 0 16 26" aria-hidden="true">
                <path d="M8 0C2.4 8.38708 0 13.4194 0 17.6129C0 19.8373 0.842856 21.9706 2.34315 23.5435C3.84344 25.1164 5.87827 26 8 26C10.1217 26 12.1566 25.1164 13.6569 23.5435C15.1571 21.9706 16 19.8373 16 17.6129C16 13.4194 13.6 8.38708 8 0Z" fill="currentColor" />
              </svg>
              Вода
            </button>
            <button
              type="button"
              className={screen === 'stats' ? 'nav-item nav-item-active' : 'nav-item'}
              aria-current={screen === 'stats' ? 'page' : undefined}
              onClick={() => openScreen('stats')}
            >
              <svg className="nav-mark" width="18" height="26" viewBox="0 0 17.8594 26.0001" aria-hidden="true">
                <path d="M1.5 26.0001V13.9287M8.92969 26V6.5M16.3594 26V0" stroke="currentColor" strokeWidth="3" />
              </svg>
              Статистика
            </button>
            <button type="button" className="nav-item">
              <img src={navTrophy} alt="" />
              Достижения
            </button>
            <button type="button" className="nav-item">
              <img src={navProfile} alt="" />
              Профиль
            </button>
          </div>
        </nav>
        {celebrate && (
          <div className="celebration" role="status">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className={piece.round ? 'confetti confetti-round' : 'confetti'}
                style={{
                  left: `${piece.left}%`,
                  width: piece.size,
                  height: piece.round ? piece.size : piece.size * 1.6,
                  background: piece.color,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                  ['--drift' as string]: `${piece.drift}px`,
                }}
              />
            ))}
            <p className="celebration-title">Цель достигнута!</p>
          </div>
        )}
      </section>
    </main>
  )
}
