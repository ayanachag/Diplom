import { useState, type FormEvent } from 'react'
import './App.css'
import statusSignal from './assets/water/status-signal.svg'
import statusWifi from './assets/water/status-wifi.svg'
import statusBattery from './assets/water/status-battery.svg'
import progressRing from './assets/water/progress-ring.svg'
import bottle from './assets/water/bottle.svg'
import settingsIcon from './assets/water/settings.svg'
import dropPraise from './assets/water/drop-praise.svg'
import dropRemain from './assets/water/drop-remain.svg'
import divider from './assets/water/divider.svg'
import progressBar from './assets/water/progress-bar.svg'
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
import navWater from './assets/water/nav-water.svg'
import navStats from './assets/water/nav-stats.svg'
import navTrophy from './assets/water/nav-trophy.svg'
import navProfile from './assets/water/nav-profile.svg'

const GOAL = 2000

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

export default function App() {
  const [consumed, setConsumed] = useState(1000)
  const [period, setPeriod] = useState<Period>('day')
  const [customOpen, setCustomOpen] = useState(false)
  const [customValue, setCustomValue] = useState('')

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
    setConsumed((value) => Math.min(9999, value + Math.round(amount)))
  }

  function submitCustom(event: FormEvent) {
    event.preventDefault()
    addWater(Number(customValue))
    setCustomValue('')
    setCustomOpen(false)
  }

  return (
    <main className="stage">
      <section className="phone" aria-label="Трекер воды">
        <header className="status">
          <time dateTime="09:41">9:41</time>
          <div className="status-icons" aria-hidden="true">
            <img src={statusSignal} alt="" />
            <img src={statusWifi} alt="" />
            <img src={statusBattery} alt="" />
          </div>
        </header>

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
            <img src={progressRing} alt="" />
            <img className="bottle" src={bottle} alt="Бутылка с водой" />
          </div>

          <p className="amount">
            <span>{grouped(consumed)} / </span>
            <em>{grouped(GOAL)} мл</em>
          </p>

          <div className="cards">
            <article className="card card-praise">
              <img src={dropPraise} alt="" />
              <p className="praise-title">{praise.title}</p>
              <p className="praise-text">{praise.text}</p>
            </article>

            <article className="card card-remain">
              <img src={dropRemain} alt="" />
              <p className="remain-label">Осталось</p>
              <p className="remain-value">{remaining} мл</p>
              <img className="remain-divider" src={divider} alt="" />
              <p className="percent">{percent} %</p>
              <p className="percent-label">выполнено</p>
              <img className="remain-bar" src={progressBar} alt="" />
            </article>
          </div>
        </div>

        <div className="actions">
          {actions.map((action) => (
            <button
              key={action.amount}
              type="button"
              className="action"
              onClick={() => addWater(action.amount)}
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
            onClick={() => setCustomOpen(true)}
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

        <nav className="nav" aria-label="Разделы">
          <img className="nav-bg" src={navBg} alt="" />
          <div className="nav-items">
            <button type="button" className="nav-item nav-item-active" aria-current="page">
              <img src={navWater} alt="" />
              Вода
            </button>
            <button type="button" className="nav-item">
              <img src={navStats} alt="" />
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
      </section>
    </main>
  )
}
