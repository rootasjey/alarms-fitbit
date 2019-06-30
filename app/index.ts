import clock, { TickEvent } from 'clock'
import { display }          from 'display'
import { HeartRateSensor }  from 'heart-rate'

import { formatHours }      from '../common/format'
import * as activities      from './activities'
import * as battery         from './battery'
import * as colors          from './colors'
import * as date            from './date'
import * as digits          from './digits'
import * as layout          from './layout'
import * as hoursUtils      from './hours'
import * as minutesUtils    from './minutes'
import * as secondsUtils    from './seconds'
import * as settings        from './settings'
import { Keys }             from './settings';

clock.granularity = 'seconds'

const clockDigits: ClockDigits = {
  hours: [],
  minutes: [],
  seconds: [],
  separator: undefined,
}

let hr: HeartRateSensor;

if (HeartRateSensor) {
  hr = new HeartRateSensor()
  hr.start()
}

let displayChanged = true

digits.init(clockDigits)
colors.setDigitsColors(clockDigits)
date.initElements()
battery.initElements()

settings.init((settings: Settings) => {
  // console.log('settings chnged')
})

settings.resetUILocks()

// Layout
layout.setScaleClock(clockDigits)
layout.setPositionClock(clockDigits)

date.sync()

date.addTapEvent()
hoursUtils.addTapEvent()
minutesUtils.addTapEvent()
digits.addTapEventOnTop()
digits.addTapEventOnBottom()

activities.showConditional()
battery.showConditional()
date.showConditional()

clock.ontick = (event: TickEvent) => {
  if (!display.on) return

  const hours = formatHours(event.date.getHours())
  const minutes = event.date.getMinutes()
  const seconds = event.date.getSeconds()

  if (settings.getValue(Keys.displayBatteryDate)) {
    date.updateLazily(seconds)
    battery.updateLazily(seconds)
  }

  if (displayChanged) {
    hoursUtils.updateDigits(clockDigits.hours, hours)
    minutesUtils.updateDigits(clockDigits.minutes, minutes)

    if (settings.getValue(Keys.displaySeconds)) {
      secondsUtils.updateDigits(clockDigits.seconds, seconds)
    }

    displayChanged = false

  } else {
    hoursUtils.updateDigitsLazily(clockDigits.hours, hours)
    minutesUtils.updateDigitsLazily(clockDigits.minutes, minutes)

    if (settings.getValue(Keys.displaySeconds)) {
      secondsUtils.updateDigitsLazily(clockDigits.seconds, seconds)
    }
  }

  if (settings.getValue(Keys.displaySeconds)) {
    secondsUtils.startAnimation()
  }

  minutesUtils.startAnimation(seconds)
  hoursUtils.startAnimation(minutes, seconds)

  activities.sync(hr)
}

display.addEventListener('change', (event) => {
  if (display.on) {
    displayChanged = true

    if (hr) hr.start()
    return
  }

  if (hr) hr.stop()
})
