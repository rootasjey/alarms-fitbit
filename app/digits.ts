import document         from 'document'

import * as format      from '../common/format'
import * as activities  from './activities'
import * as animations  from './animations'
import * as settings    from './settings'
import { Keys }         from './settings'

export const addTapEventOnBottom = () => {
  const rect = document.getElementById('actions-bottom-clock')
  if (!rect) return

  rect.addEventListener('click', () => {
    if (settings.getValue(Keys.isBottomDigitTapOn) === false) {
      return
    }

    settings.setValue({
      key: Keys.isBottomDigitTapOn,
      value: false,
    })

    onTapRectActivities(2)
    .then((result) => {
        settings.setValue({
          key: Keys.isBottomDigitTapOn,
          value: true,
        })
      })
  })
}

export const addTapEventOnTop = () => {
  const rect = document.getElementById('actions-top-clock')
  if (!rect) return

  rect.addEventListener('click', () => {
    if (settings.getValue(Keys.isTopDigitTapOn) === false) {
      return
    }

    settings.setValue({
      key: Keys.isTopDigitTapOn,
      value: false,
    })

    onTapRectActivities(1)
    .then((result) => {
        settings.setValue({
          key: Keys.isTopDigitTapOn,
          value: true,
        })
      })
  })
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

function onTapRectActivities(groupNumber: number): Promise<{ action: string, success: boolean }> {
  const rectActivities = document.getElementById(`activity-${groupNumber}`)

  const key = groupNumber === 1 ? Keys.displayActivities : Keys.displayActivities2

  const visibility = settings.getValue(key)

  const newVisibility = !visibility

  if (!rectActivities) return Promise.resolve({ action: 'none', success: false })

  if (newVisibility) {
    return activities.show(groupNumber)
      .then((result) => {
        activities.sync()

        settings.setValue({
          key,
          value: newVisibility,
        })

        return { action: 'visible', success: true }
      })

  } else {
    return activities.hide(groupNumber)
      .then((result) => {
        settings.setValue({
          key,
          value: newVisibility,
        })

        return { action: 'hidden', success: true }
      })
  }
}
