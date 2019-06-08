import clock, { TickEvent } from 'clock'

import { formatHours } from '../common/format'
import { initClockDigits, addTapEventOnTopDigits } from './digits'

import {
  initDateElements,
  updateDateLazily,
  updateDate,
  addTapEventOnDate
} from './date';

import { initBatteryElements, updateBatteryLazily } from './battery';
import { initDigitsColors } from './colors';
import { addTapEventOnHours, startHoursAnimation, updateHoursDigits } from './hours'
import { startMinutesAnimation, updateMinutesDigits } from './minutes'
import { startSecondsAnimation, updateSecondsDigits, checkSecondsPosition } from './seconds'
import { initSettings, getSettingsValue, SettingsKeys } from './settings';
import { display } from 'display';

clock.granularity = 'seconds'

const clockDigits: ClockDigits = {
  hours: [],
  minutes: [],
  seconds: [],
  separator: undefined,
}

initClockDigits(clockDigits)
initDigitsColors(clockDigits)
initDateElements()
initBatteryElements()

initSettings((settings: Settings) => {
  // console.log('settings chnged')
})

updateDate()
addTapEventOnDate()
addTapEventOnHours()
addTapEventOnTopDigits()

clock.ontick = (event: TickEvent) => {
  const hours = formatHours(event.date.getHours())
  const minutes = event.date.getMinutes()
  const seconds = event.date.getSeconds()

  if (getSettingsValue(SettingsKeys.displayBatteryDate)) {
    updateDateLazily(seconds)
    updateBatteryLazily(seconds)
  }

  if (seconds % 10 === 0) {
    checkSecondsPosition()
  }

  updateHoursDigits(clockDigits.hours, hours)
  updateMinutesDigits(clockDigits.minutes, minutes)
  updateSecondsDigits(clockDigits.seconds, seconds)

  startSecondsAnimation()
  startMinutesAnimation(seconds)
  startHoursAnimation(minutes, seconds)
}

display.addEventListener('change', () => {
  if (display.on) {
    checkSecondsPosition()
    return
  }
})
