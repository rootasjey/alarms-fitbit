import document from 'document'
import { goals, today } from 'user-activity'
import { getForegroundColor, getBackgroundColor } from './colors'
import { getSettingsValue, SettingsKeys } from './settings';
import { animateIntValue, fadeOut } from './animationFactory';
import { HeartRateSensor } from 'heart-rate';

const ACTIVITIES_LIST = [
  'steps',
  'hr',
]

export const hideActivities = () => {
  ACTIVITIES_LIST.map((activity) => {
    const textElem = document.getElementById(`activity__${activity}-text`)
    const iconElem = document.getElementById(`activity__${activity}-icon`)
    if (!textElem || !iconElem) return

    textElem.style.opacity = 0
    iconElem.style.opacity = 0
  })

  setTimeout(() => {
    const rectActivities = document.getElementById('activity')

    if (!rectActivities) return

    rectActivities.style.opacity = 0
    rectActivities.style.visibility = 'hidden'
  }, 500);
}

export const showActivities = () => {
  const rectActivities = document.getElementById('activity')

  if (!rectActivities) return

  rectActivities.style.opacity = 1
  rectActivities.style.visibility = 'visible'

  ACTIVITIES_LIST.map((activity) => {
    const textElem = document.getElementById(`activity__${activity}-text`)
    const iconElem = document.getElementById(`activity__${activity}-icon`)
    if (!textElem || !iconElem) return

    textElem.style.opacity = 1
    iconElem.style.opacity = 1
  })
}

export const showActivitiesIfSettings = () => {
  const activityShouldBeVisible = getSettingsValue(SettingsKeys.displayActivities)

  const elem = document.getElementById('activity')
  if (!elem) return

  const activityIsVisible = elem.style.opacity !== 0 && elem.style.visibility !== 'hidden'

  // console.log(`elem.style.opacity: ${elem.style.opacity}`)
  // console.log(`elem.style.visibility: ${elem.style.visibility}`)
  // console.log(`activityShouldBeVisible: ${activityShouldBeVisible} activityIsVisible: ${activityIsVisible}`)

  if (activityShouldBeVisible === activityIsVisible) {
    return
  }

  if (activityShouldBeVisible) { showActivities() }
  else { hideActivities() }
}

export const updateActivities = (hr?: HeartRateSensor) => {
  ACTIVITIES_LIST.map((activity) => {
    if (activity === 'hr') { updateHR(hr); return }
    updateActivityValue(activity)
  })
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
