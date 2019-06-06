import document from 'document';

const DATE_ELEM: DateElements = {
  day: undefined,
  number: undefined,
  month: undefined,
  numberMonth: undefined,
}

export const addTapEventOnDate = () => {
  const container = document.getElementById('date')
  if(!container) { return }

  container.onclick = () => {
    const { day, month, number, numberMonth } = DATE_ELEM
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
  const day = document.getElementById('date__day')
  const number = document.getElementById('date__number')
  const month = document.getElementById('date__month')
  const numberMonth = document.getElementById('date__number-month')

  DATE_ELEM.day = day ? day : undefined
  DATE_ELEM.number = number ? number : undefined
  DATE_ELEM.month = month ? month : undefined
  DATE_ELEM.numberMonth = numberMonth ? numberMonth : undefined
}

export const updateDate = () => {
  const today = new Date()
  const day = numberToDay(today.getDay())
  const month = numberToMonth(today.getMonth())
  const number = today.getDate()

  if (DATE_ELEM.day) { DATE_ELEM.day.text = day }
  if (DATE_ELEM.month) { DATE_ELEM.month.text = month }
  if (DATE_ELEM.number) { DATE_ELEM.number.text = `${number}` }
  if (DATE_ELEM.numberMonth) { DATE_ELEM.numberMonth.text = `${number}/${today.getMonth() + 1}` }
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

export const updateDateLazyly = (seconds: number) => {
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
