import { me as device } from 'device'

const screen = device.screen || { width: 348, height: 250 }

const { height, width } = screen

const deviceType = width === 300 && height === 300 ? 'Versa' : 'Ionic'

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
