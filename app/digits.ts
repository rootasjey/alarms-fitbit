import document from 'document'

import { formatDigits } from '../common/format'
import { getSettingsValue, SettingsKeys, updateSettings } from './settings';
import { hideActivities, showActivities, updateActivities } from './activities';

export const addTapEventOnBottomDigits = () => {
  const rect = document.getElementById('actions-bottom-clock')
  if (!rect) return

  rect.addEventListener('click', () => { onTapRectActivities(2) })
}

export const addTapEventOnTopDigits = () => {
  const rect = document.getElementById('actions-top-clock')
  if (!rect) return

  rect.addEventListener('click', () => { onTapRectActivities(1) })
}

/**
 * Retrieve DOM elements to display the clock.
 * @param clockDigits Empty array that will contain DOM elements
 */
export const initClockDigits = (clockDigits: ClockDigits) => {
  const numbers = [0, 1, 2, 3]

  numbers.map((value) => {
    const digit = document.getElementById(`hours-digits-${value}`)

    if (digit) { clockDigits.hours.push(digit); }
  })

  numbers.map((value) => {
    const digit = document.getElementById(`minutes-digits-${value}`)

    if (digit) { clockDigits.minutes.push(digit) }
  })

  numbers.map((value) => {
    const digit = document.getElementById(`seconds-digits-${value}`)

    if (digit) { clockDigits.seconds.push(digit) }
  })

  const separator = document.getElementById('digits-separator')
  clockDigits.separator = separator ? separator : undefined;
}

/**
 * Set new values to elements.
 * @param arrDigits Array of DOM elements of the clock.
 * @param values Text values to set for each DOM elements.
 */
export const updateDigits = (arrDigits: Element[], values: number[]) => {
  arrDigits.map((digit, index) => {
    digit.text = formatDigits(values[index])
  })
}

function onTapRectActivities(groupNumber: number) {
  const rectActivities = document.getElementById(`activity-${groupNumber}`)

  const key = groupNumber === 1 ? SettingsKeys.displayActivities : SettingsKeys.displayActivities2

  const visibility = getSettingsValue(key)

  const newVisibility = !visibility

  if (!rectActivities) return

  if (newVisibility) {
    rectActivities.style.opacity = 1
    showActivities(groupNumber)
    updateActivities()

  } else {
    rectActivities.style.opacity = 0
    hideActivities(groupNumber)
  }

  updateSettings({
    key,
    value: newVisibility,
  })
}
