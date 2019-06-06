import clock, { TickEvent } from 'clock'

import { formatHours } from '../common/format'
import { initClockDigits } from './digits'

import { startHoursAnimation, updateHoursDigits } from './hours'
import { startMinutesAnimation, updateMinutesDigits } from './minutes'
import { startSecondsAnimation, updateSecondsDigits } from './seconds'
import { initDigitsColors } from './colors';
import { initDateElements, updateDateLazyly, updateDate, addTapEventOnDate } from './date';

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

updateDate()
addTapEventOnDate()

clock.ontick = (event: TickEvent) => {
  const hours = formatHours(event.date.getHours())
  const minutes = event.date.getMinutes()
  const seconds = event.date.getSeconds()

  updateDateLazyly(seconds)

  updateHoursDigits(clockDigits.hours, hours)
  updateMinutesDigits(clockDigits.minutes, minutes)
  updateSecondsDigits(clockDigits.seconds, seconds)

  startSecondsAnimation()
  startMinutesAnimation(seconds)
  startHoursAnimation(minutes, seconds)
}
