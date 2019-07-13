import document         from 'document'

import * as format      from '../common/format'
import * as animations  from './animations'
import * as digits      from './digits'
import * as layout      from './layout'
import * as seconds     from './seconds'
import * as settings    from './settings'
import { Keys }         from './settings'

/** Toggle seconds when tapping on minutes */
export const addTapEvent = () => {
  const rect = document.getElementById('actions-minutes')
  if (!rect) { return }

  rect.addEventListener('click', () => {
    if (settings.getValue(Keys.isMinutesTapOn) === false) {
      return
    }

    settings.setValue({
      key: Keys.isMinutesTapOn,
      value: false,
    })

    seconds.toggle()
      .then((result) => {
        const { action } = result

        settings.setValue({
          key: Keys.displaySeconds,
          value: action === 'visible',
        })

        settings.setValue({
          key: Keys.isMinutesTapOn,
          value: true,
        })
      })
  })
}

/** Start minutes animation. */
export function startAnimation(seconds: number) {
  if (seconds !== 59) { return }

  resetPosition();

  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`minutes-digits-${n}`)
      if (!element) { return }

      const startY = element.y
      const endY = layout.getNextY({ type: 'minutes', y: startY})
      const finalType = layout.getNextAnimationType({ type: 'minutes', y: startY})
      const resetYto = layout.getResetYTo('minutes')

      const animation = animations.createDigitsAnimation({
        startY,
        endY,
        element,
        finalType,
        resetYto,
        hideAfterAnimation: false,
        step: 4,
      })

      animation.start()
    })
}

export const updateDigits = (arrayDigits: Element[], value: number = 0) => {
  const prevValue = format.formatMinSec(value - 1)
  const nextValue = format.formatMinSec(value + 1)
  const currPlusTwoValue = format.formatMinSec(value + 2)

  var sorted = arrayDigits
    .map((element) => element)
    .sort((a, b) => {
      return a.y - b.y
    })

  digits.update(sorted, [prevValue, value, nextValue, currPlusTwoValue])
}

export const updateDigitsLazily = (arrDigits: Element[], value: number = 0) => {
  const currPlusTwoValue = format.formatMinSec(value + 2)

  // Subsequent runs
  if (arrDigits.length > 1 && arrDigits[0].text.length > 1) {
    arrDigits.some((digits) => {
      if (digits.y === layout.getResetYTo('minutes')) {
        digits.text = format.formatDigits(currPlusTwoValue)
        return true
      }

      return false
    })

    return
  }

  // First run
  const prevValue = format.formatMinSec(value - 1)
  const nextValue = format.formatMinSec(value + 1)

  digits.update(arrDigits, [prevValue, value, nextValue, currPlusTwoValue])
}

/** Reset Y position of visual elements (it desync sometimes). */
function resetPosition() {
  [0, 1, 2, 3]
    .map((n) => {
      return document.getElementById(`minutes-digits-${n}`)
    })
    .sort((a, b) => {
      if (!a || !b) return 0

      const aValue = parseInt(a.text)
      const bValue = parseInt(b.text)

      // NOTE: Special case 59 -> 0
      if (aValue > 55 && bValue < 4) return -1
      if (aValue < 4 && bValue > 55) return 1

      return aValue - bValue
    })
    .map((element, index) => {
      if (!element) return

      element.y = layout.getMinutesHoursPositionY(index)
    })
}
