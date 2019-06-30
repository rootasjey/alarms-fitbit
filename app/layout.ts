import { me as device } from 'device'

import { FinalType } from '../common/enumerations'

const screen = device.screen || { width: 348, height: 250 }

const { height, width } = screen

const deviceType = width === 300 && height === 300 ? 'Versa' : 'Ionic'

export const getBatteryPositionY = (chargeLevel: number, charging: boolean) => {
  const vPos: MultiLayoutNestedNumHash = {
    Ionic: {
      default: {
        circle0: 10,
        circle1: 25,
        circle2: 40,
        circle3: 55,
      },
      offset: {
        circle0: 45,
        circle1: 60,
        circle2: 75,
        circle3: 90,
      }
    },
    Versa: {
      default: {
        circle0: 10,
        circle1: 25,
        circle2: 40,
        circle3: 55,
      },
      offset: {
        circle0: 45,
        circle1: 60,
        circle2: 75,
        circle3: 90,
      }
    }
  }

  const vLayout = (chargeLevel < 25 || charging) ? 'offset' : 'default'
  return  vPos[deviceType][vLayout]
}

/** Returns next animation type according to the current Y coordinate. */
export const getNextAnimationType = (config: LayoutPositionConfig): FinalType => {
  const { type, y } = config

  const animationTypes: MultiLayoutNestedFinalTypeHash = {
    Ionic: {
      hours: {
        30: FinalType.hide,
        150: FinalType.background,
        270: FinalType.foreground,
        390: FinalType.background,
      },
      minutes: {
        30: FinalType.hide,
        150: FinalType.background,
        270: FinalType.foreground,
        390: FinalType.background,
      },
      seconds: {
        120: FinalType.hide,
        150: FinalType.background,
        180: FinalType.foreground,
        210: FinalType.background,
      },
    },
    Versa: {
      hours: {
        40: FinalType.hide,
        180: FinalType.background,
        320: FinalType.foreground,
        460: FinalType.background,
      },
      minutes: {
        40: FinalType.hide,
        180: FinalType.background,
        320: FinalType.foreground,
        460: FinalType.background,
      },
      seconds: {
        120: FinalType.hide,
        150: FinalType.background,
        180: FinalType.foreground,
        210: FinalType.background,
      },
    },
  }

  return animationTypes[deviceType][type][y]
}

/**
 * Return the next Y for animation.
 * @param type Digits' type (hour, minutes, seconds)
 * @param y Current Y coordinate.
 */
export const getNextY = (config: LayoutPositionConfig) => {
  const { type, y } = config

  const vN1 = 40 // versa number 1
  const vN2 = 180
  const vN3 = 320
  const vN4 = 460

  const correspondances: MultiLayoutNestedNumHash = {
    Ionic: {
      hours: {
        30: 0,
        150: 30,
        270: 150,
        390: 270,
      },
      minutes: {
        30: 0,
        150: 30,
        270: 150,
        390: 270,
      },
      seconds: {
        120: 90,
        150: 120,
        180: 150,
        210: 180,
      },
    },
    Versa: {
      hours: {
        [vN1]: 0,
        [vN2]: vN1,
        [vN3]: vN2,
        [vN4]: vN3,
      },
      minutes: {
        [vN1]: 0,
        [vN2]: vN1,
        [vN3]: vN2,
        [vN4]: vN3,
      },
      seconds: {
        120: 90,
        150: 120,
        180: 150,
        210: 180,
      },
    },
  }

  return correspondances[deviceType][type][y];
}

export const getResetYTo = (type: 'hours' | 'minutes' | 'seconds') => {
  const yCoord: MultiLayoutNumHash = {
    Ionic: {
      hours: 390,
      minutes: 390,
      seconds: 210,
    },
    Versa: {
      hours: 460,
      minutes: 460,
      seconds: 210,
    },
  }

  return yCoord[deviceType][type]
}

export const setScaleClock = (digits: ClockDigits) => {
  const fontSize = {
    Ionic: 100,
    Versa: 80,
    VersaLite: 80,
  }

  digits.hours.map((element) => {
    element.style.fontSize = fontSize[deviceType]
  })

  digits.minutes.map((element) => {
    element.style.fontSize = fontSize[deviceType]
  })

  if (digits.separator) {
    digits.separator.style.fontSize = fontSize[deviceType]
  }
}


export const getSecondsPositionY = (index: number) => {
  const vPos: MultiLayoutNumHash = {
    Ionic: {
      0: 120,
      1: 150,
      2: 180,
      3: 210,
    },
    Versa: {
      0: 120,
      1: 150,
      2: 180,
      3: 210,
    }
  }

  return vPos[deviceType][index]
}

export const setPositionClock = (digits: ClockDigits) => {
  const xySeparator = {
    Ionic: { x: 170, y: 140 },
    Versa: { x: 150, y: 180 },
  }

  const yHourMinutesPosition = {
    Ionic: [ 30, 150, 270, 390 ],
    Versa: [ 40, 180, 320, 460 ],
  }

  const xPositions = {
    Ionic: {
      hour: 60,
      minutes: 190,
      seconds: 300,
    },
    Versa: {
      hour: 60,
      minutes: 170,
      seconds: 260,
    },
  }

  digits.hours.map((element, index) => {
    const textElement = element as TextElement
    textElement.x = xPositions[deviceType].hour

    textElement.y = yHourMinutesPosition[deviceType][index];
  })

  digits.minutes.map((element, index) => {
    const textElement = element as TextElement
    textElement.x = xPositions[deviceType].minutes

    textElement.y = yHourMinutesPosition[deviceType][index];
  })

  digits.seconds.map((element) => {
    const textElement = element as TextElement
    textElement.x = xPositions[deviceType].seconds
  })

  if (digits.separator) {
    const textElement = digits.separator as TextElement
    textElement.x = xySeparator[deviceType].x
    textElement.y = xySeparator[deviceType].y
  }
}
