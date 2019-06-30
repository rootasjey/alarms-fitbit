import document         from 'document'

import * as format      from '../common/format'
import * as animations  from './animations'
import * as digits      from './digits'
import * as layout      from './layout'
import * as settings    from './settings'
import { Keys }         from './settings'

/** Start seconds animation. */
export const startAnimation = () => {
  resetPosition();

  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`seconds-digits-${n}`)
      if (!element) return

      const startY = element.y
      const endY = layout.getNextY({ type: 'seconds', y: startY })
      const finalType = layout.getNextAnimationType({ type: 'seconds', y: startY })
      const resetYto = layout.getResetYTo('seconds')

      const animation = animations.createDigitsAnimation({
        startY,
        endY,
        element,
        finalType,
        resetYto,
      })

      animation.start()
    })
}

/** Toggle visibility */
export const toggle = () => {
  const isVisible = settings.getValue(Keys.displaySeconds)

  const secondsDigits = [0, 1, 2, 3]
    .map((n) => {
      return document.getElementById(`seconds-digits-${n}`)
    })
    .sort((a, b) => {
      if (!a || !b) return 0

      const aValue = parseInt(a.text)
      const bValue = parseInt(b.text)

      // NOTE: Special case 59 -> 0
      if (aValue > 56 && bValue < 4) return -1
      if (aValue < 4 && bValue > 56) return 1

      return aValue - bValue
    })

  const action = isVisible ? 'hidden' : 'visible'
  const animationsPromises: Array<Promise<ResultAnimationConfig>> = []

  if (isVisible) {
    secondsDigits.map((element) => {
      const animation = animations.fadeOut({ element })
      animationsPromises.push(animation)
    })

  } else {
    secondsDigits.map((element, index) => {
      const animation =
        (index === 0) ? animations.fadeIn({ element, endValue: 0 }) :
        (index === 1 || index === 3) ? animations.fadeIn({ element, endValue: .5 }) :
        animations.fadeIn({ element })

      animationsPromises.push(animation)
    })
  }

  return Promise.all(animationsPromises)
    .then(() => {
      return { success: true, action }
    })
}

export const updateDigits = (arrDigits: Element[], value: number = 0) => {
  const prevValue = format.formatMinSec(value - 1)
  const nextValue = format.formatMinSec(value + 1)
  const currPlusTwoValue = format.formatMinSec(value + 2)

  digits.update(arrDigits, [prevValue, value, nextValue, currPlusTwoValue])
}

export const updateDigitsLazily = (arrDigits: Element[], value: number = 0) => {
  const currPlusTwoValue = format.formatMinSec(value + 2)

  // Subsequent runs
  if (arrDigits.length > 1 && arrDigits[0].text.length > 1) {
    arrDigits.some((digits) => {
      if (digits.y === layout.getResetYTo('seconds')) {
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

/** Reset Y position of seconds visual elements (it desync sometimes). */
function resetPosition() {
  [0, 1, 2, 3]
    .map((n) => {
      return document.getElementById(`seconds-digits-${n}`)
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

      element.y = layout.getSecondsPositionY(index)
    })
}
