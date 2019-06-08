import document from 'document';
import { fadeIn, fadeOut } from './animationFactory';
import { getSettingsValue, SettingsKeys } from './settings';

const ELEMENTS: DateElements = {
  container: null,
  children : {
    day: null,
    number: null,
    month: null,
    numberMonth: null,
  },
}

export const addTapEventOnDate = () => {
  const rect = document.getElementById('actions-date')
  if(!rect) { return }

  rect.onclick = () => {
    const { day, month, number, numberMonth } = ELEMENTS.children
    if (!day || !month || !number || !numberMonth) return

    if (numberMonth.style.visibility === 'visible') {
      numberMonth.style.visibility = 'hidden'

      day.style.visibility = 'visible'
      number.style.visibility = 'visible'
      month.style.visibility = 'visible'

      // TODO: save

      return
    }

    numberMonth.style.visibility = 'visible'

    day.style.visibility = 'hidden'
    number.style.visibility = 'hidden'
    month.style.visibility = 'hidden'
    // TODO: save
  }
}

export const initDateElements = () => {
  ELEMENTS.container = document.getElementById('date')
  ELEMENTS.children.day = document.getElementById('date__day')
  ELEMENTS.children.number = document.getElementById('date__number')
  ELEMENTS.children.month = document.getElementById('date__month')
  ELEMENTS.children.numberMonth = document.getElementById('date__number-month')
}

export const toggleDate = () => {
  const { container } = ELEMENTS
  if (!container) return 'hidden'

  const visibility = getSettingsValue(SettingsKeys.displayBatteryDate)

  if (visibility) {
    const { children } = ELEMENTS

    for (const key of Object.keys(children)) {
      fadeOut(children[key])
    }

    return 'hidden'

  } else {
    const { children } = ELEMENTS

    for (const key of Object.keys(children)) {
      fadeIn(children[key])
    }

    return 'visible'
  }
}

export const updateDate = () => {
  const today = new Date()
  const day = numberToDay(today.getDay())
  const month = numberToMonth(today.getMonth())
  const number = today.getDate()

  if (ELEMENTS.children.day) { ELEMENTS.children.day.text = day }
  if (ELEMENTS.children.month) { ELEMENTS.children.month.text = month }
  if (ELEMENTS.children.number) { ELEMENTS.children.number.text = `${number}` }
  if (ELEMENTS.children.numberMonth) { ELEMENTS.children.numberMonth.text = `${number}/${today.getMonth() + 1}` }
}

function numberToDay(n: number) {
  const days: Days = {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT',
  }

  return days[n]
}

export const updateDateLazily = (seconds: number) => {
  if (seconds % 5 !== 0) { return }
  updateDate()
}

function numberToMonth(n: number) {
  const months: Months = {
    0: 'JAN',
    1: 'FEB',
    2: 'MAR',
    3: 'APR',
    4: 'MAY',
    5: 'JUN',
    6: 'JUL',
    7: 'AUG',
    8: 'SEP',
    9: 'OCT',
    10: 'NOV',
    11: 'DEC',
  }

  return months[n]
}
