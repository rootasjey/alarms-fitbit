import document from 'document'

import { FinalType } from '../common/enumerations'
import { formatDigits, formatMinSec } from '../common/format'
import { createDigitsAnimation } from './animationFactory'
import { updateDigits } from './digits'


/** Returns next animation type according to the current Y coordinate. */
function getNextAnimationType(y: number) {
  switch (y) {
    case 30:
      return FinalType.hide
    case 150:
      return FinalType.background
    case 270:
      return FinalType.foreground
    case 390:
      return FinalType.background

    default:
      return FinalType.hide
  }
}

/** Returns next Y coordinate according to the current one. */
function getNextY(y: number) {
  switch (y) {
    case 30:
      return 0
    case 150:
      return 30
    case 270:
      return 150
    case 390:
      return 270

    default:
      return 390
  }
}

/** Start minutes animation. */
export function startMinutesAnimation(seconds: number) {
  if (seconds !== 0) { return }

  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`minutes-digits-${n}`)
      if (!element) { return }

      const startY = element.y
      const endY = getNextY(startY)
      const finalType = getNextAnimationType(startY)

      const animation = createDigitsAnimation({
        startY,
        endY,
        element,
        finalType,
        resetYto: 390,
        hideAfterAnimation: false,
      })

      animation.start()
    })
}

export const updateMinutesDigits = (arrDigits: Element[], value: number = 0) => {
  const currPlusOneValue = formatMinSec(value + 1)

  // Subsequent runs
  if (arrDigits.length > 1 && arrDigits[0].text.length > 1) {
    arrDigits.some((digits) => {
      if (digits.y === 390) {
        digits.text = formatDigits(currPlusOneValue)
        return true
      }

      return false
    })

    return
  }

  const prevValue = formatMinSec(value - 1)
  const nextValue = formatMinSec(value + 1)

  updateDigits(arrDigits, [prevValue, value, nextValue, currPlusOneValue])
}
