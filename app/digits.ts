import document from 'document'

import { formatDigits } from '../common/format'

/**
 * Retrieve DOM elements to display the clock.
 * @param clockDigits Empty array that will contain DOM elements
 */
export const initClockDigits = (clockDigits: ClockDigits) => {
  const numbers = [0, 1, 2, 3]

  numbers.map((value) => {
    const digit = document.getElementById(`hours-digits-${value}`)

    if (digit) { clockDigits.left.push(digit); }
  })

  numbers.map((value) => {
    const digit = document.getElementById(`minutes-digits-${value}`)

    if (digit) { clockDigits.right.push(digit) }
  })

  numbers.map((value) => {
    const digit = document.getElementById(`seconds-digits-${value}`)

    if (digit) { clockDigits.seconds.push(digit) }
  })

  const separator = document.getElementById('digits-separator')
  clockDigits.separator = separator ? separator : undefined;
}

/**
 * Set new values to elements.
 * @param arrDigits Array of DOM elements of the clock.
 * @param values Text values to set for each DOM elements.
 */
export const updateDigits = (arrDigits: Element[], values: number[]) => {
  arrDigits.map((digit, index) => {
    digit.text = formatDigits(values[index])
  })
}
