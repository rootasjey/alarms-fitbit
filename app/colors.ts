import * as layout from './layout'

const COLORS = {
  foreground: '#f1c40f',
  background: '#ffffff',
}

export const getBackgroundColor = () => COLORS.background
export const getForegroundColor = () => COLORS.foreground
export const setForegroundColor = (newColor: string) => COLORS.foreground = newColor

/**
 * Set the initial color on the foreground clock digits.
 * @param clockDigits Array of DOM elements representing clock digits.
 */
export const setDigitsColors = (clockDigits: ClockDigits) => {
  clockDigits.hours.some(setColorOnMiddleHourMinutes)
  clockDigits.minutes.some(setColorOnMiddleHourMinutes)

  setColorSeparator(clockDigits.separator)
}

/**
 * Set the foreground color on the middle digits.
 * @param element DOM element to set the color if it's the middle one.
 */
function setColorOnMiddleHourMinutes (element: Element) {
  if (element.y === layout.getMiddleHoursMinutesY()) {
    element.style.fill = COLORS.foreground
    return true
  }

  return false
}

function setColorSeparator(separator?: Element) {
  if (!separator) { return }
  separator.style.fill = COLORS.foreground
}
