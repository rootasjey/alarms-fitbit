import document from 'document'

import { FinalType } from '../common/enumerations'
import { formatDigits, formatMinSec } from '../common/format'
import { createDigitsAnimation } from './animationFactory'
import { updateDigits } from './digits'


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

/** Start seconds animation. */
export function startSecondsAnimation() {
  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`seconds-digits-${n}`)
      if (!element) return

      const startY = element.y
      const endY = getNextY(startY)
      const finalType = getNextAnimationType(startY)
      const animation = createDigitsAnimation({ startY, endY, element, finalType, resetYto: 210 })

      animation.start()
    })
}

export const updateSecondsDigits = (arrDigits: Element[], value: number = 0) => {
  const currPlusTwoValue = formatMinSec(value + 2)

  // Subsequent runs
  if (arrDigits.length > 1 && arrDigits[0].text.length > 1) {
    arrDigits.some((digits) => {
      if (digits.y === 210) {
        digits.text = formatDigits(currPlusTwoValue)
        return true
      }

      return false
    })

    return
  }

  // First run
  const prevValue = formatMinSec(value - 1)
  const nextValue = formatMinSec(value + 1)

  updateDigits(arrDigits, [prevValue, value, nextValue, currPlusTwoValue])
}
