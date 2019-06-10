import clock, { TickEvent } from 'clock'
import { display } from 'display'
import { HeartRateSensor } from 'heart-rate'

import { formatHours } from '../common/format'

import { showActivitiesIfSettings, updateActivities } from './activities'

import {
  initBatteryElements,
  updateBatteryLazily,
  showBatteryIfSettings
} from './battery'

import { initDigitsColors } from './colors'

import {
  initDateElements,
  updateDateLazily,
  updateDate,
  addTapEventOnDate,
  showDateIfSettings
} from './date'

import { initClockDigits, addTapEventOnTopDigits, addTapEventOnBottomDigits } from './digits'
import { addTapEventOnHours, startHoursAnimation, updateHoursDigits } from './hours'
import { startMinutesAnimation, updateMinutesDigits } from './minutes'
import { startSecondsAnimation, updateSecondsDigits, checkSecondsPosition } from './seconds'
import { initSettings, getSettingsValue, SettingsKeys } from './settings'

clock.granularity = 'seconds'

const clockDigits: ClockDigits = {
  hours: [],
  minutes: [],
  seconds: [],
  separator: undefined,
}

const hr = new HeartRateSensor()
hr.start()

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
addTapEventOnBottomDigits()

showActivitiesIfSettings()
showBatteryIfSettings()
showDateIfSettings()

clock.ontick = (event: TickEvent) => {
  const hours = formatHours(event.date.getHours())
  const minutes = event.date.getMinutes()
  const seconds = event.date.getSeconds()

  if (getSettingsValue(SettingsKeys.displayBatteryDate)) {
    updateDateLazily(seconds)
    updateBatteryLazily(seconds)
  }

  // if (seconds % 10 === 0) {
  //   checkSecondsPosition()
  // }

  updateHoursDigits(clockDigits.hours, hours)
  updateMinutesDigits(clockDigits.minutes, minutes)
  updateSecondsDigits(clockDigits.seconds, seconds)

  startSecondsAnimation()
  startMinutesAnimation(seconds)
  startHoursAnimation(minutes, seconds)

  if (getSettingsValue(SettingsKeys.displayActivities)) {
    updateActivities(hr)
  }
}

display.addEventListener('change', () => {
  if (display.on) {
    // checkSecondsPosition()
    hr.start()
    return
  }

  hr.stop()
})
