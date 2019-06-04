import clock, { TickEvent } from 'clock'

import { formatHours } from '../common/format'
import { initClockDigits } from './digits'

import { startHoursAnimation, updateHoursDigits } from './hours'
import { startMinutesAnimation, updateMinutesDigits } from './minutes'
import { startSecondsAnimation, updateSecondsDigits } from './seconds'
import { initDigitsColors } from './colors';

clock.granularity = 'seconds'

const clockDigits: ClockDigits = {
  left: [],
  right: [],
  seconds: [],
  separator: undefined,
}

initClockDigits(clockDigits)
initDigitsColors(clockDigits)

clock.ontick = (event: TickEvent) => {
  const hours = formatHours(event.date.getHours())
  const minutes = event.date.getMinutes()
  const seconds = event.date.getSeconds()

  updateHoursDigits(clockDigits.left, hours)
  updateMinutesDigits(clockDigits.right, minutes)
  updateSecondsDigits(clockDigits.seconds, seconds)

  startSecondsAnimation()
  startMinutesAnimation(seconds)
  startHoursAnimation(minutes, seconds)
}
