import document from 'document'
import { goals, today } from 'user-activity'
import { getForegroundColor, getBackgroundColor } from './colors'
import { getSettingsValue, SettingsKeys } from './settings'
import { animateIntValue, fadeOut } from './animationFactory'
import { HeartRateSensor } from 'heart-rate'

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

export const hideActivities = (listNumber: number) => {
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

export const showActivities = (listNumber: number) => {
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

export const showActivitiesIfSettings = () => {
  showTopActivitiesIfSettings()
  showBottomActivitiesIfSettings()
}

export const updateActivities = (hr?: HeartRateSensor) => {
  if (getSettingsValue(SettingsKeys.displayActivities)) {
    ACTIVITIES_LIST.map((activity) => {
      if (activity === 'hr') { updateHR(hr); return }
      updateActivityValue(activity)
    })
  }

  if (getSettingsValue(SettingsKeys.displayActivities2)) {
    ACTIVITIES_LIST2.map((activity) => {
      updateActivityValue(activity)
    })
  }
}

function showTopActivitiesIfSettings() {
  const activitiesTopShouldBeVisible = getSettingsValue(SettingsKeys.displayActivities)

  const elem = document.getElementById('activity-1')
  if (!elem) return

  const activitiesTopAreVisible = elem.style.opacity !== 0 && elem.style.visibility !== 'hidden'

  if (activitiesTopShouldBeVisible === activitiesTopAreVisible) {
    return
  }

  if (activitiesTopShouldBeVisible) { showActivities(1) }
  else { hideActivities(1) }
}

function showBottomActivitiesIfSettings() {
  const activitiesBottomShouldBeVisible = getSettingsValue(SettingsKeys.displayActivities2)

  const elem = document.getElementById('activity-2')
  if (!elem) return

  const activitiesBottomAreVisible = elem.style.opacity !== 0 && elem.style.visibility !== 'hidden'

  if (activitiesBottomShouldBeVisible === activitiesBottomAreVisible) {
    return
  }

  if (activitiesBottomShouldBeVisible) { showActivities(2) }
  else { hideActivities(2) }
}

function updateActivityValue(activity: string) {
  const textElem = document.getElementById(`activity__${activity}-text`)
  const iconElem = document.getElementById(`activity__${activity}-icon`)

  if (!textElem || !iconElem) return

  // @ts-ignore
  const value: number = today.local[activity] ? today.local[activity] : 0
  const goalValue: number = goals[activity] ? goals[activity] : 0

  textElem.text = `${value}`
  // animateIntValue({ end: value, element: textElem })

  if (value >= goalValue) {
    textElem.style.fill = getForegroundColor()
    iconElem.style.fill = getForegroundColor()

  } else {
    textElem.style.fill = getBackgroundColor()
    iconElem.style.fill = getBackgroundColor()
  }
}

function updateHR(hr?: HeartRateSensor) {
  if (!hr)  return

  const textElem = document.getElementById(`activity__hr-text`)
  const iconElem = document.getElementById(`activity__hr-icon`) as ImageElement

  if (!textElem || !iconElem) return

  textElem.text = hr.heartRate ? `${hr.heartRate}` : '--'

  textElem.style.fill = getBackgroundColor()
  iconElem.style.fill = getBackgroundColor()

  iconElem.style.opacity = 1
  fadeOut(iconElem)
}
