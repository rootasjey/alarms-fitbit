import document         from 'document'

import { FinalType }    from '../common/enumerations'
import * as format      from '../common/format'
import * as animations  from './animations'
import * as digits      from './digits'
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

  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`minutes-digits-${n}`)
      if (!element) { return }

      const startY = element.y
      const endY = getNextY(startY)
      const finalType = getNextAnimationType(startY)

      const animation = animations.createDigitsAnimation({
        startY,
        endY,
        element,
        finalType,
        resetYto: 390,
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
      if (digits.y === 390) {
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

