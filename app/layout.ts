import { me as device } from 'device'

const screen = device.screen || { width: 348, height: 250 }

const { height, width } = screen

const deviceType = width === 300 && height === 300 ? 'Versa' : 'Ionic'

export const getBatteryPositionY = (chargeLevel: number, charging: boolean) => {
  const vPos: MultiLayoutNestedHash = {
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

export const getSecondesPositionY = (index: number) => {
  const vPos: MultiLayoutHash = {
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
