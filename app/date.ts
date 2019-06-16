import document             from 'document'

import * as format          from '../common/format'
import * as animations      from './animations'
import * as settings        from './settings'
import { DateFormat, Keys } from './settings'

const ELEMENTS: DateElements = {
  container: null,
  children : {
    day: null,
    number: null,
    month: null,
    numberDay: null,
    numberMonth: null,
  },
}

export const addTapEvent = () => {
  const rect = document.getElementById('actions-date')
  if(!rect) { return }

  rect.onclick = () => {
    if (!settings.getValue(Keys.displayBatteryDate)) return

    if (settings.getValue(Keys.dateFormat) === DateFormat.dateMonth) {
      showDayDateMonthOnly()

      settings.setValue({
        key: Keys.dateFormat,
        value: DateFormat.dayDateMonth,
      })

      return
    }

    showDateMonthOnly()

    settings.setValue({
      key: Keys.dateFormat,
      value: DateFormat.dateMonth,
    })
  }
}

export const initElements = () => {
  ELEMENTS.container = document.getElementById('date')
  ELEMENTS.children.day = document.getElementById('date__day')
  ELEMENTS.children.number = document.getElementById('date__number')
  ELEMENTS.children.month = document.getElementById('date__month')
  ELEMENTS.children.numberDay = document.getElementById('date__number-day')
  ELEMENTS.children.numberMonth = document.getElementById('date__number-month')
}

/** Show if settings allows it. */
export const showConditional = () => {
  const dateShouldBeVisible = settings.getValue(Keys.displayBatteryDate)

  const dateIsVisible = Object
    .keys(ELEMENTS.children)
    .reduce((result: boolean, key: string) => {
      const elem = ELEMENTS.children[key]
      if (!elem) return true

      return result || (elem.style.opacity !== 0 && elem.style.visibility !== 'hidden')
    }, false)

  if (settings.getValue(Keys.dateFormat) === DateFormat.dateMonth) {
    showDateMonthOnly()
  }

  if (dateShouldBeVisible !== dateIsVisible) {
    const { children } = ELEMENTS
    const animationFun = dateShouldBeVisible ? animations.fadeIn : animations.fadeOut

    for (const key of Object.keys(children)) {
      animationFun({ element: children[key] })
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

  const animationsPromises: Array<Promise<ResultAnimationConfig>> = []
  let action = ''

  const children = getDateChildren()

  if (visibility) {
    children.map((value) => {
      const animation = animations.fadeOut({ element: ELEMENTS.children[value] })
      animationsPromises.push(animation)
    })

    action = 'hidden'

  } else {
    children.map((value) => {
      const animation = animations.fadeIn({ element: ELEMENTS.children[value], endValue: .5 })
      animationsPromises.push(animation)
    })

    action = 'visible'
  }

  return Promise.all(animationsPromises)
    .then((result) => {
      return { success: true, action }
    })
}

export const sync = () => {
  const today = new Date()
  const day = numberToDay(today.getDay())
  const month = numberToMonth(today.getMonth())
  const number = today.getDate()

  if (ELEMENTS.children.day) { ELEMENTS.children.day.text = day }
  if (ELEMENTS.children.month) { ELEMENTS.children.month.text = month }
  if (ELEMENTS.children.number) { ELEMENTS.children.number.text = `${number}` }
  if (ELEMENTS.children.numberDay) { ELEMENTS.children.numberDay.text = format.formatDigits(number) }
  if (ELEMENTS.children.numberMonth) { ELEMENTS.children.numberMonth.text = format.formatDigits(today.getMonth() + 1) }
}

export const updateLazily = (seconds: number) => {
  if (seconds % 5 !== 0) { return }
  sync()
}

/** Return date children according to current date format settings */
function getDateChildren() {
  if (settings.getValue(Keys.dateFormat) === settings.DateFormat.dayDateMonth) {
    return Object.keys(ELEMENTS.children)
      .filter((value) => value === 'day' || value === 'number' || value === 'month')
  }

  return Object.keys(ELEMENTS.children)
    .filter((value) => value === 'numberDay' || value === 'numberMonth')
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

function showDateMonthOnly() {
  const { day, month, number, numberDay, numberMonth } = ELEMENTS.children
  if (!day || !month || !number || !numberDay || !numberMonth) return

  numberDay.style.visibility = 'visible'
  numberMonth.style.visibility = 'visible'

  day.style.visibility = 'hidden'
  number.style.visibility = 'hidden'
  month.style.visibility = 'hidden'
}

function showDayDateMonthOnly() {
  const { day, month, number, numberDay, numberMonth } = ELEMENTS.children
  if (!day || !month || !number || !numberDay || !numberMonth) return

  numberDay.style.visibility = 'hidden'
  numberMonth.style.visibility = 'hidden'

  day.style.visibility = 'visible'
  number.style.visibility = 'visible'
  month.style.visibility = 'visible'
}
