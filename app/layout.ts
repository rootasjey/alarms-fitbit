import { me as device } from 'device'

import { FinalType } from '../common/enumerations'
import document from 'document';

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
        150: FinalType.hide,
        180: FinalType.background,
        210: FinalType.foreground,
        240: FinalType.background,
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
        150: 110,
        180: 150,
        210: 180,
        240: 210,
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
      seconds: 240,
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
      0: 150,
      1: 180,
      2: 210,
      3: 240,
    }
  }

  return vPos[deviceType][index]
}

export const setActionContainersPosition = () => {
  const positions: MultiLayoutNestedNumHash = {
    Ionic: {
      'actions-hours': { x: 40, y: 80 },
      'actions-minutes': { x: 190, y: 80 },
      'actions-date': { x: 0, y: 170 },
      'actions-top-clock': { x: 60, y: 0 },
      'actions-bottom-clock': { x: 60, y: 170, width: 240 },
    },
    Versa: {
      'actions-hours': { x: 40, y: 110 },
      'actions-minutes': { x: 150, y: 110 },
      'actions-date': { x: 0, y: 220 },
      'actions-top-clock': { x: 40, y: 0 },
      'actions-bottom-clock': { x: 60, y: 210, width: 240 },
    },
  };

  const devicePos = positions[deviceType];

  [
    'actions-hours',
    'actions-minutes',
    'actions-date',
    'actions-top-clock',
    'actions-bottom-clock'
  ].map((id) => {
    const element = document.getElementById(id)

    if (element) {
      const rect = element as RectElement

      rect.x = devicePos[id].x
      rect.y = devicePos[id].y

      if (typeof devicePos[id].width === 'number') {
        rect.width = devicePos[id].width
      }
    }
  })
}

export const setActivitiesPosition = () => {
  const containerPos: MultiLayoutNestedNumHash = {
    Ionic: {
      'activity-1': { x: 55, y: 0 },
      'activity-2': { x: 55, y: 160 },
    },
    Versa: {
      'activity-1': { x: 55, y: 0 },
      'activity-2': { x: 55, y: 210 },
    },
  }

  const imgPos: MultiLayoutNestedNumHash = {
    Ionic: {
      'activity__elevationGain-icon': { x: 60, y: 30 },
      'activity__hr-icon': { x: 220, y: 30 },
      'activity__steps-icon': { x: 60, y: 185 },
      'activity__activeMinutes-icon': { x: 220, y: 185 },
      'activity__calories-icon': { x: 60, y: 220 },
      'activity__distance-icon': { x: 190, y: 220 },
    },
    Versa: {
      'activity__elevationGain-icon': { x: 60, y: 30 },
      'activity__hr-icon': { x: 190, y: 30 },
      'activity__steps-icon': { x: 60, y: 235 },
      'activity__activeMinutes-icon': { x: 220, y: 235 },
      'activity__calories-icon': { x: 60, y: 270 },
      'activity__distance-icon': { x: 190, y: 270 },
    },
  }

  const txtPos: MultiLayoutNestedNumHash = {
    Ionic: {
      'activity__elevationGain-text': { x: 90, y: 50 },
      'activity__hr-text': { x: 250, y: 50 },
      'activity__steps-text': { x: 90, y: 205 },
      'activity__activeMinutes-text': { x: 250, y: 205 },
      'activity__calories-text': { x: 90, y: 240 },
      'activity__distance-text': { x: 220, y: 240 },
    },
    Versa: {
      'activity__elevationGain-text': { x: 90, y: 50 },
      'activity__hr-text': { x: 220, y: 50 },
      'activity__steps-text': { x: 90, y: 255 },
      'activity__activeMinutes-text': { x: 250, y: 255 },
      'activity__calories-text': { x: 90, y: 290 },
      'activity__distance-text': { x: 220, y: 290 },
    },
  }

  const containerDevicePos = containerPos[deviceType];
  const imgDevicePos = imgPos[deviceType];
  const txtDevicePos = txtPos[deviceType];

  ['activity-1', 'activity-2' ]
    .map((id) => {
      const element = document.getElementById(id)

      if (element) {
        const rect = element as RectElement

        rect.x = containerDevicePos[id].x
        rect.y = containerDevicePos[id].y
      }
    });

  [
    'activity__elevationGain-icon',
    'activity__hr-icon',
    'activity__steps-icon',
    'activity__activeMinutes-icon',
    'activity__calories-icon',
    'activity__distance-icon',
  ].map((id) => {
    const element = document.getElementById(id)

    if (element) {
      const img = element as ImageElement
      img.x = imgDevicePos[id].x
      img.y = imgDevicePos[id].y
    }
  });

  [
    'activity__elevationGain-text',
    'activity__hr-text',
    'activity__steps-text',
    'activity__activeMinutes-text',
    'activity__calories-text',
    'activity__distance-text',
  ].map((id) => {
    const element = document.getElementById(id)

    if (element) {
      const img = element as TextElement
      img.x = txtDevicePos[id].x
      img.y = txtDevicePos[id].y
    }
  });
};

export const setClockPosition = (digits: ClockDigits) => {
  const xySeparator = {
    Ionic: { x: 170, y: 140 },
    Versa: { x: 150, y: 180 },
  }

  const yHourMinutesPosition = {
    Ionic: [ 30, 150, 270, 390 ],
    Versa: [ 40, 180, 320, 460 ],
  }

  const ySecondsPosition = {
    Ionic: [ 120, 150, 180, 210 ],
    Versa: [ 150, 180, 210, 240 ],
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

  digits.seconds.map((element, index) => {
    const textElement = element as TextElement

    textElement.x = xPositions[deviceType].seconds
    textElement.y = ySecondsPosition[deviceType][index]
  })

  if (digits.separator) {
    const textElement = digits.separator as TextElement
    textElement.x = xySeparator[deviceType].x
    textElement.y = xySeparator[deviceType].y
  }
}
