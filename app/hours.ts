import document from 'document'

import { FinalType } from '../common/enumerations'
import { formatDigits, formatHours } from '../common/format'
import { createDigitsAnimation } from './animationFactory'
import { updateDigits } from './digits'
import { toggleDate } from './date';
import { toggleBattery } from './battery';
import { updateSettings } from './settings';

/** Toggle date and battery when tapping on hours. */
export const addTapEventOnHours = () => {
  const rect = document.getElementById('actions-hours')
  if (!rect) return

  rect.addEventListener('click', () => {
    const dateVisibility = toggleDate()
    const batteryVisibility = toggleBattery()

    updateSettings({
      key: 'displayBatteryDate',
      value: dateVisibility === 'visible' && batteryVisibility === 'visible'
    })
  })
}

/** Start minutes animation. */
export const startHoursAnimation = (minutes: number, seconds: number) => {
  if (minutes !== 0 || seconds !== 0) { return }

  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`hours-digits-${n}`)
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

export const updateHoursDigits = (arrayDigits: Element[], value: number = 0) => {
  const currPlusOneValue = formatHours(value + 1)

  // Subsequent runs
  if (arrayDigits.length > 1 && arrayDigits[0].text.length > 1) {
    arrayDigits.some((digits) => {
      if (digits.y === 390) {
        digits.text = formatDigits(currPlusOneValue)
        return true
      }

      return false
    })

    return
  }

  const prevValue = formatHours(value - 1)
  const nextValue = formatHours(value + 1)

  updateDigits(arrayDigits, [prevValue, value, nextValue, currPlusOneValue])
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
