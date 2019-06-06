import document from 'document'
import { battery } from 'power'
import { getForegroundColor, getBackgroundColor } from './colors';

const ELEMENTS: BatteryElements = {
  container: null,
  circles: {
    circle0: null,
    circle1: null,
    circle2: null,
    circle3: null,
  },
}

const LEVELS: BatteryLevels = {
  circle0: 15,
  circle1: 25,
  circle2: 50,
  circle3: 75,
}

export const initBatteryElements = () => {
  ELEMENTS.container = document.getElementById('battery')
  ELEMENTS.circles.circle0 = document.getElementById('battery__circle-0')
  ELEMENTS.circles.circle1 = document.getElementById('battery__circle-1')
  ELEMENTS.circles.circle2 = document.getElementById('battery__circle-2')
  ELEMENTS.circles.circle3 = document.getElementById('battery__circle-3')
}

export const updateBattery = () => {
  const { chargeLevel } = battery
  const { circles } = ELEMENTS

  for (const key of Object.keys(circles)) {
    const element = circles[key]
    const circle = circles[key]

    if (!element || !circle) continue

    const level = LEVELS[key]

    if (chargeLevel < level) {
      circle.style.fill = getBackgroundColor()
      circle.style.opacity = .5
    } else {
      circle.style.fill = getForegroundColor()
      circle.style.opacity = 1
    }
  }
}

export const updateBatteryLazily = (seconds: number) => {
  if (seconds % 5 !== 0) return

  updateBattery()
}
