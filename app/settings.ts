/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
*/
import { me } from 'appbit'
import * as fs from 'fs'
import * as messaging from 'messaging'

const SETTINGS_TYPE = 'cbor'
const SETTINGS_FILE = 'settings.cbor'

// const KEY_TEMPERATURE_UNIT = 'imperialUnit'
// const KEY_MANUAL_LOCATION = 'manualLocation'

export enum DateFormat {
  dateMonth = 'dateMonth',
  dayDateMonth = 'dayDateMonth',
}

export enum SettingsKeys {
  dateFormat = 'dateFormat',
  displayActivities = 'displayActivities',
  displayBatteryDate = 'displayBatteryDate',
}

let onsettingschange: Function

let settings: Settings = {
  dateFormat: DateFormat.dayDateMonth,
  displayActivities: false,
  displayBatteryDate: false,
}

export function initSettings(callback: Function) {
  settings = loadSettings()
  // console.log(JSON.stringify(settings))
  onsettingschange = callback
  onsettingschange(settings)
}

export function getSettingsValue(key = '') {
  if (key.length > 0) return settings[key]
  return undefined
}

export function updateSettings(config: SettingsUpdateConfig) {
  const { key, value } = config
  settings[key] = value
}

// Received message containing settings data
messaging.peerSocket.addEventListener('message', function (evt) {
  settings[evt.data.key] = evt.data.value
  onsettingschange(settings)

  // // Update immediately weather value when unit changed
  // if (evt.data.key === KEY_TEMPERATURE_UNIT) {
  //   initMetric({ activityName: 'weather' })
  // }

  // if (evt.data.key === KEY_MANUAL_LOCATION) {
  //   initMetric({ activityName: 'weather', useFreshData: true })
  // }
})

// Register for the unload event
me.addEventListener('unload', saveSettings)

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE)
  } catch (ex) {
    return {}
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE)
}
