import document         from 'document'

import { FinalType }    from '../common/enumerations'
import * as format      from '../common/format'
import * as animations  from './animations'
import * as digits      from './digits'
import * as layout      from './layout'

/** Start seconds animation. */
export const startAnimation = () => {
  resetPosition();

  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`seconds-digits-${n}`)
      if (!element) return

      const startY = element.y
      const endY = getNextY(startY)
      const finalType = getNextAnimationType(startY)
      const animation = animations.createDigitsAnimation({ startY, endY, element, finalType, resetYto: 210 })

      animation.start()
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
      if (digits.y === 210) {
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

/** Returns next animation type according to the current Y coordinate. */
function getNextAnimationType(y: number) {
  switch (y) {
    case 120:
      return FinalType.hide
    case 150:
      return FinalType.background
    case 180:
      return FinalType.foreground
    case 210:
      return FinalType.background

    default:
      return FinalType.hide
  }
}

/** Returns next Y coordinate according to the current one. */
function getNextY(currentY: number) {
  switch (currentY) {
    case 120:
      return 90
    case 150:
      return 120
    case 180:
      return 150
    case 210:
      return 180

    default:
      return 210
  }
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
      if (aValue > 56 && bValue < 4) return -1
      if (aValue < 4 && bValue > 56) return 1

      return aValue - bValue
    })
    .map((element, index) => {
      if (!element) return

      element.y = layout.getSecondesPositionY(index)
    })
}
