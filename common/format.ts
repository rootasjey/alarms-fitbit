import { preferences } from 'user-settings';

export const formatDigits = (num: number) => {
  return num.toString().length > 1 ? num.toString() : `0${num}`
}

export const formatHours = (num: number) => {
  num = num < 0 ? 24 + num : num
  return preferences.clockDisplay === '12h' ? (num % 12 || 12) : (num % 24)
}

export const formatMinSec = (num: number) => {
  num = num < 0 ? 60 + num : num
  return num % 60
}

export const getTotalHoursFormat = () => {
  return preferences.clockDisplay === '12h' ? 12 : 24
}

/** Add zero in front of numbers < 10 */
export const zeroPad = (num: number) => {
  let str = ''

  if (num < 10) {
    str = "0" + num;
  }
  return str;
}
