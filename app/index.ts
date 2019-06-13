import clock, { TickEvent } from 'clock'
import { display }          from 'display'
import { HeartRateSensor }  from 'heart-rate'

import { formatHours }      from '../common/format'
import * as activities      from './activities'
import * as battery         from './battery'
import * as colors          from './colors'
import * as date            from './date'
import * as digits          from './digits'
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

const hr = new HeartRateSensor()
hr.start()

let displayChanged = true

digits.init(clockDigits)
colors.setDigitsColors(clockDigits)
date.initElements()
battery.initElements()

settings.init((settings: Settings) => {
  // console.log('settings chnged')
})

date.sync()

date.addTapEvent()
hoursUtils.addTapEvent()
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
    secondsUtils.updateDigits(clockDigits.seconds, seconds)

    displayChanged = false

  } else {
    hoursUtils.updateDigitsLazily(clockDigits.hours, hours)
    minutesUtils.updateDigitsLazily(clockDigits.minutes, minutes)
    secondsUtils.updateDigitsLazily(clockDigits.seconds, seconds)
  }

  secondsUtils.startAnimation()
  minutesUtils.startAnimation(seconds)
  hoursUtils.startAnimation(minutes, seconds)

  activities.sync(hr)
}

display.addEventListener('change', (event) => {
  if (display.on) {
    displayChanged = true
    hr.start()
    return
  }

  hr.stop()
})
