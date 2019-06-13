import document             from 'document'
import { HeartRateSensor }  from 'heart-rate'
import { goals, today }     from 'user-activity'

import * as animations      from './animations'
import * as colors          from './colors'
import * as settings        from './settings'
import { Keys }             from './settings'

const ACTIVITIES_LIST = [
  'steps',
  'elevationGain',
  'hr',
]

const ACTIVITIES_LIST2 = [
  'activeMinutes',
  'calories',
  'distance',
]

export const hide = (listNumber: number) => {
  const list = listNumber === 1 ? ACTIVITIES_LIST : ACTIVITIES_LIST2

  list.map((activity) => {
    const textElem = document.getElementById(`activity__${activity}-text`)
    const iconElem = document.getElementById(`activity__${activity}-icon`)
    if (!textElem || !iconElem) return

    textElem.style.opacity = 0
    iconElem.style.opacity = 0
  })

  setTimeout(() => {
    const rectActivities = document.getElementById(`activity-${listNumber}`)

    if (!rectActivities) return

    rectActivities.style.opacity = 0
    rectActivities.style.visibility = 'hidden'
  }, 500);
}

export const show = (listNumber: number) => {
  const list = listNumber === 1 ? ACTIVITIES_LIST : ACTIVITIES_LIST2
  const rectActivities = document.getElementById(`activity-${listNumber}`)

  if (!rectActivities) return

  rectActivities.style.opacity = 1
  rectActivities.style.visibility = 'visible'

  list.map((activity) => {
    const textElem = document.getElementById(`activity__${activity}-text`)
    const iconElem = document.getElementById(`activity__${activity}-icon`)

    if (!textElem || !iconElem) return

    textElem.style.opacity = 1
    iconElem.style.opacity = 1
  })
}

/** Show if settings allows it. */
export const showConditional = () => {
  showTopConditional()
  showBottomConditional()
}

export const sync = (hr?: HeartRateSensor) => {
  if (settings.getValue(Keys.displayActivities)) {
    ACTIVITIES_LIST.map((activity) => {
      if (activity === 'hr') { updateHR(hr); return }
      updateValue(activity)
    })
  }

  if (settings.getValue(Keys.displayActivities2)) {
    ACTIVITIES_LIST2.map((activity) => {
      updateValue(activity)
    })
  }
}

function showTopConditional() {
  const activitiesTopShouldBeVisible = settings.getValue(Keys.displayActivities)

  const elem = document.getElementById('activity-1')
  if (!elem) return

  const activitiesTopAreVisible = elem.style.opacity !== 0 && elem.style.visibility !== 'hidden'

  if (activitiesTopShouldBeVisible === activitiesTopAreVisible) {
    return
  }

  if (activitiesTopShouldBeVisible) { show(1) }
  else { hide(1) }
}

function showBottomConditional() {
  const activitiesBottomShouldBeVisible = settings.getValue(Keys.displayActivities2)

  const elem = document.getElementById('activity-2')
  if (!elem) return

  const activitiesBottomAreVisible = elem.style.opacity !== 0 && elem.style.visibility !== 'hidden'

  if (activitiesBottomShouldBeVisible === activitiesBottomAreVisible) {
    return
  }

  if (activitiesBottomShouldBeVisible) { show(2) }
  else { hide(2) }
}

function updateValue(activity: string) {
  const textElem = document.getElementById(`activity__${activity}-text`)
  const iconElem = document.getElementById(`activity__${activity}-icon`)

  if (!textElem || !iconElem) return

  // @ts-ignore
  const value: number = today.local[activity] ? today.local[activity] : 0
  const goalValue: number = goals[activity] ? goals[activity] : 0

  textElem.text = `${value}`

  if (value >= goalValue) {
    textElem.style.fill = colors.getForegroundColor()
    iconElem.style.fill = colors.getForegroundColor()

  } else {
    textElem.style.fill = colors.getBackgroundColor()
    iconElem.style.fill = colors.getBackgroundColor()
  }
}

function updateHR(hr?: HeartRateSensor) {
  if (!hr)  return

  const textElem = document.getElementById(`activity__hr-text`)
  const iconElem = document.getElementById(`activity__hr-icon`) as ImageElement

  if (!textElem || !iconElem) return

  textElem.text = hr.heartRate ? `${hr.heartRate}` : '--'

  textElem.style.fill = colors.getBackgroundColor()
  iconElem.style.fill = colors.getBackgroundColor()

  iconElem.style.opacity = 1
  animations.fadeOut(iconElem)
}
