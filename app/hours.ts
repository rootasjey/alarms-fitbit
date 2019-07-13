import document         from 'document'

import { FinalType }    from '../common/enumerations'
import * as format      from '../common/format'
import * as animations  from './animations'
import * as battery     from './battery'
import * as date        from './date'
import * as digtis      from './digits'
import * as layout      from './layout'
import * as settings    from './settings'
import { Keys }         from './settings';

/** Toggle date and battery when tapping on hours. */
export const addTapEvent = () => {
  const rect = document.getElementById('actions-hours')
  if (!rect) { return }

  rect.addEventListener('click', () => {
    if (settings.getValue(Keys.isHoursTapOn) === false) {
      return
    }

    settings.setValue({
      key: Keys.isHoursTapOn,
      value: false,
    })

    const dateToggleProm = date.toggle()
    const batteryToggleProm = battery.toggle()

    Promise.all([dateToggleProm, batteryToggleProm])
      .then((result) => {
        settings.setValue({
          key: Keys.displayBatteryDate,
          value: result[0].action === 'visible' && result[1].action === 'visible'
        })

        settings.setValue({
          key: Keys.isHoursTapOn,
          value: true,
        })
      })
  })
}

/** Start minutes animation. */
export const startAnimation = (minutes: number, seconds: number) => {
  if (minutes !== 59 || seconds !== 59) { return }

  resetPosition();

  [0, 1, 2, 3]
    .map((n) => {
      const element = document.getElementById(`hours-digits-${n}`)
      if (!element) { return }

      const startY = element.y
      const endY = layout.getNextY({ type: 'hours', y: startY })
      const finalType = layout.getNextAnimationType({ type: 'hours', y: startY })
      const resetYto = layout.getResetYTo('hours')

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
  const prevValue = format.formatHours(value - 1)
  const nextValue = format.formatHours(value + 1)
  const currPlusTwoValue = format.formatHours(value + 2)

  var sorted = arrayDigits
    .map((element) => element)
    .sort((a, b) => {
      return a.y - b.y
    })

  digtis.update(sorted, [prevValue, value, nextValue, currPlusTwoValue])
}

export const updateDigitsLazily = (arrayDigits: Element[], value: number = 0) => {
  const currPlusTwoValue = format.formatHours(value + 2)

  // Subsequent runs
  if (arrayDigits.length > 1 && arrayDigits[0].text.length > 1) {
    arrayDigits.some((digits) => {
      if (digits.y === layout.getResetYTo('hours')) {
        digits.text = format.formatDigits(currPlusTwoValue)
        return true
      }

      return false
    })

    return
  }

  // First run
  const prevValue = format.formatHours(value - 1)
  const nextValue = format.formatHours(value + 1)

  digtis.update(arrayDigits, [prevValue, value, nextValue, currPlusTwoValue])
}

/** Reset Y position of seconds visual elements (it desync sometimes). */
function resetPosition() {
  [0, 1, 2, 3]
    .map((n) => {
      return document.getElementById(`hours-digits-${n}`)
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

