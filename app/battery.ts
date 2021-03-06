import document         from 'document'
import { battery }      from 'power'

import * as animations  from './animations'
import * as colors      from './colors'
import * as layout      from './layout'
import * as settings    from './settings'
import { Keys }         from './settings'

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

export const initElements = () => {
  ELEMENTS.container = document.getElementById('battery')
  ELEMENTS.circles.circle0 = document.getElementById('battery__circle-0')
  ELEMENTS.circles.circle1 = document.getElementById('battery__circle-1')
  ELEMENTS.circles.circle2 = document.getElementById('battery__circle-2')
  ELEMENTS.circles.circle3 = document.getElementById('battery__circle-3')
}

/** Show if settings allows it. */
export const showConditional = () => {
  const batteryShouldBeVisible = settings.getValue(Keys.displayBatteryDate)

  const batteryIsVisible = Object
    .keys(ELEMENTS.circles)
    .some((key) => {
      const elem = ELEMENTS.circles[key]
      if (!elem) return true

      return elem.style.opacity !== 0 && elem.style.visibility !== 'hidden'
    })

  if (batteryShouldBeVisible !== batteryIsVisible) {
    const { circles } = ELEMENTS
    const animationFun = batteryShouldBeVisible ? animations.fadeIn : animations.fadeOut

    for (const key of Object.keys(circles)) {
      animationFun({ element: circles[key] })
    }
  }
}

/** Toggle visibility */
export const toggle = () => {
  const { container } = ELEMENTS
  if (!container) {
    return Promise.resolve({ success: false, action: 'none' })
  }

  const visibility = settings.getValue(Keys.displayBatteryDate)

  const animationsPromises = []
  let action = ''

  if (visibility) {
    const { circles } = ELEMENTS

    for (const key of Object.keys(circles)) {
      const animation = animations.fadeOut({ element: circles[key] })
      animationsPromises.push(animation)
    }

    action = 'hidden'

  } else {
    const { circles } = ELEMENTS

    for (const key of Object.keys(circles)) {
      animations.fadeIn({ element: circles[key] })
    }

    action = 'visible'
  }

  return Promise.all(animationsPromises)
    .then((resultArray) => {
      return { success: true, action }
    })
}

function sync() {
  const { chargeLevel, charging } = battery
  const { circles } = ELEMENTS

  const position = layout.getBatteryPositionY(chargeLevel, charging)

  for (const key of Object.keys(circles)) {
    const element = circles[key]
    const circle = circles[key] as CircleElement

    if (!element || !circle) continue

    const level = LEVELS[key]

    if (chargeLevel < level) {
      circle.style.fill = colors.getBackgroundColor()
      circle.style.opacity = .5
    } else {
      circle.style.fill = colors.getForegroundColor()
      circle.style.opacity = 1
    }

    circle.cy = position[key]
  }
}

export const updateLazily = (seconds: number) => {
  if (seconds % 5 !== 0) return

  sync()
}
