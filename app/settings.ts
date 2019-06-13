/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
*/
import { me }         from 'appbit'
import * as fs        from 'fs'
import * as messaging from 'messaging'

const SETTINGS_TYPE = 'cbor'
const SETTINGS_FILE = 'settings.cbor'

// const KEY_TEMPERATURE_UNIT = 'imperialUnit'
// const KEY_MANUAL_LOCATION = 'manualLocation'

export enum DateFormat {
  dateMonth = 'dateMonth',
  dayDateMonth = 'dayDateMonth',
}

export enum Keys {
  dateFormat          = 'dateFormat',
  displayActivities   = 'displayActivities',
  displayActivities2  = 'displayActivities2',
  displayBatteryDate  = 'displayBatteryDate',
  isBottomDigitTapOn  = 'isBottomDigitTapOn',
  isHoursTapOn        = 'isHoursTapOn',
  isTopDigitTapOn     = 'isTopDigitTapOn',
}

let onsettingschange: Function

let settings: Settings = {
  dateFormat          : DateFormat.dayDateMonth,
  displayActivities   : false,
  displayActivities2  : false,
  displayBatteryDate  : false,
  isBottomDigitTapOn  : true,
  isHoursTapOn        : true,
  isTopDigitTapOn     : true,
}

export const init = (callback: Function) => {
  settings = load()
  // console.log(JSON.stringify(settings))
  onsettingschange = callback
  onsettingschange(settings)
}

export const getValue = (key = '') => {
  if (key.length > 0) return settings[key]
  return undefined
}

export const resetUILocks = () => {
  setValue({
    key: Keys.isBottomDigitTapOn,
    value: true,
  })

  setValue({
    key: Keys.isTopDigitTapOn,
    value: true,
  })

  setValue({
    key: Keys.isHoursTapOn,
    value: true,
  })
}

export const setValue = (config: SettingsUpdateConfig) => {
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
me.addEventListener('unload', save)

// Load settings from filesystem
function load() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE)
  } catch (ex) {
    return {}
  }
}

// Save settings to the filesystem
function save() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE)
}
