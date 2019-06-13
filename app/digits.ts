import document         from 'document'

import * as format      from '../common/format'
import * as activities  from './activities'
import * as settings    from './settings'
import { Keys }         from './settings'

export const addTapEventOnBottom = () => {
  const rect = document.getElementById('actions-bottom-clock')
  if (!rect) return

  rect.addEventListener('click', () => { onTapRectActivities(2) })
}

export const addTapEventOnTop = () => {
  const rect = document.getElementById('actions-top-clock')
  if (!rect) return

  rect.addEventListener('click', () => { onTapRectActivities(1) })
}

/**
 * Retrieve DOM elements to display the clock.
 * @param clockDigits Empty array that will contain DOM elements
 */
export const init = (clockDigits: ClockDigits) => {
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
export const update = (arrDigits: Element[], values: number[]) => {
  arrDigits.map((digit, index) => {
    digit.text = format.formatDigits(values[index])
  })
}

function onTapRectActivities(groupNumber: number) {
  const rectActivities = document.getElementById(`activity-${groupNumber}`)

  const key = groupNumber === 1 ? Keys.displayActivities : Keys.displayActivities2

  const visibility = settings.getValue(key)

  const newVisibility = !visibility

  if (!rectActivities) return

  if (newVisibility) {
    rectActivities.style.opacity = 1
    activities.show(groupNumber)
    activities.sync()

  } else {
    rectActivities.style.opacity = 0
    activities.hide(groupNumber)
  }

  settings.update({
    key,
    value: newVisibility,
  })
}
