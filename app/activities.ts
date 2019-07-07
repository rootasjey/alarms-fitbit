import document             from 'document'
import { HeartRateSensor }  from 'heart-rate'
import { goals, today }     from 'user-activity'

import * as animations      from './animations'
import * as colors          from './colors'
import * as permissions     from './permissions'
import * as settings        from './settings'
import { Keys }             from './settings'

const ACTIVITIES_LIST = [
  'elevationGain',
  'hr',
]

const ACTIVITIES_LIST2 = [
  'activeMinutes',
  'steps',
  'calories',
  'distance',
]

export const hide = (listNumber: number): Promise<{ action: 'hidden' | 'visible', success: boolean }> => {
  const list = listNumber === 1 ? ACTIVITIES_LIST : ACTIVITIES_LIST2

  const arrayAnimations = []

  list
    .filter(permissions.filterAllowedActivities)
    .map((activity) => {
      const textElem = document.getElementById(`activity__${activity}-text`)
      const iconElem = document.getElementById(`activity__${activity}-icon`)

      if (!textElem || !iconElem) return

      const animText = animations.fadeOut({ element: textElem})
      const animIcon = animations.fadeOut({ element: iconElem })

      arrayAnimations.push(animText, animIcon)
    })

  const rectActivities = document.getElementById(`activity-${listNumber}`)

  if (rectActivities) {
    const animRect = animations.fadeOut({ element: rectActivities })
    arrayAnimations.push(animRect)
  }

  return Promise.all(arrayAnimations)
    .then((result) => {
      return { action: 'hidden', success: true}
    })
}

export const show = (listNumber: number): Promise<{ success: boolean, action: 'hidden' | 'visible' | 'none' }> => {
  const list = listNumber === 1 ? ACTIVITIES_LIST : ACTIVITIES_LIST2
  const rectActivities = document.getElementById(`activity-${listNumber}`)

  if (!rectActivities) {
    return Promise.resolve({ action: 'none', success: false })
  }

  rectActivities.style.visibility = 'visible'
  rectActivities.style.opacity = 0

  const arrayAnimations = []

  const animRect = animations.fadeIn({ element: rectActivities })
  arrayAnimations.push(animRect)

  list
    .filter(permissions.filterAllowedActivities)
    .map((activity) => {
      const textElem = document.getElementById(`activity__${activity}-text`)
      const iconElem = document.getElementById(`activity__${activity}-icon`)

      if (!textElem || !iconElem) return

      const animText = animations.fadeIn({ element: textElem, endValue: .5 })
      const animIcon = animations.fadeIn({ element: iconElem, endValue: .5 })

      arrayAnimations.push(animText, animIcon)
    })

  return Promise.all(arrayAnimations)
    .then((result) => {
      return { action: 'visible', success: true }
    })
}

/** Show if settings allows it. */
export const showConditional = () => {
  showTopConditional()
  showBottomConditional()
}

export const sync = (hr?: HeartRateSensor) => {
  if (settings.getValue(Keys.displayActivities)) {
    ACTIVITIES_LIST
      .filter(permissions.filterAllowedActivities)
      .map((activity) => {
        if (activity === 'hr') { updateHR(hr); return }
        updateValue(activity)
      })
  }

  if (settings.getValue(Keys.displayActivities2)) {
    ACTIVITIES_LIST2
      .filter(permissions.filterAllowedActivities)
      .map((activity) => {
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
  const goalValue: number = (goals[activity] ? goals[activity] : 0) as number

  textElem.text = value > 1000000 ? `${value / 1000000}M` : `${value}`

  if (value >= goalValue) {
    textElem.style.fill = colors.getForegroundColor()
    iconElem.style.fill = colors.getForegroundColor()

  } else {
    textElem.style.fill = colors.getBackgroundColor()
    iconElem.style.fill = colors.getBackgroundColor()
  }
}

function updateHR(hr?: HeartRateSensor) {
  if (!hr) return

  const textElem = document.getElementById(`activity__hr-text`)
  const iconElem = document.getElementById(`activity__hr-icon`) as ImageElement

  if (!textElem || !iconElem) return

  textElem.text = hr.heartRate ? `${hr.heartRate}` : '--'

  textElem.style.fill = colors.getBackgroundColor()
  iconElem.style.fill = colors.getBackgroundColor()

  iconElem.style.opacity = 1
  iconElem.style.visibility = 'visible'

  animations.fadeOut({ element: iconElem, step: .05 })
}
