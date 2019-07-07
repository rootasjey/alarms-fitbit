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

export enum DateFormat {
  dateMonth = 'dateMonth',
  dayDateMonth = 'dayDateMonth',
}

export enum Keys {
  dateFormat          = 'dateFormat',
  displayActivities   = 'displayActivities',
  displayActivities2  = 'displayActivities2',
  displayBatteryDate  = 'displayBatteryDate',
  displaySeconds      = 'displaySeconds',
  isBottomDigitTapOn  = 'isBottomDigitTapOn',
  isHoursTapOn        = 'isHoursTapOn',
  isMinutesTapOn      = 'isMinutesTapOn',
  isTopDigitTapOn     = 'isTopDigitTapOn',
}

let onsettingschange: Function

let settings: Settings = {
  dateFormat          : DateFormat.dayDateMonth,
  displayActivities   : false,
  displayActivities2  : false,
  displayBatteryDate  : false,
  displaySeconds      : true,
  foregroundColor     : '',
  isBottomDigitTapOn  : true,
  isHoursTapOn        : true,
  isMinutesTapOn      : true,
  isTopDigitTapOn     : true,
}

const settingsDefaultValues: Settings = {
  dateFormat          : DateFormat.dayDateMonth,
  displayActivities   : false,
  displayActivities2  : false,
  displayBatteryDate  : false,
  displaySeconds      : true,
  foregroundColor     : '',
  isBottomDigitTapOn  : true,
  isHoursTapOn        : true,
  isMinutesTapOn      : true,
  isTopDigitTapOn     : true,
}

export const init = (callback: Function) => {
  settings = load()

  onsettingschange = callback
  onsettingschange(settings)
}

export const getValue = (key = '') => {
  if (key.length < 1) return undefined

  return typeof settings[key] !== 'undefined' ?
    settings[key] : settingsDefaultValues[key]
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
  const { key, value } = evt.data

  settings[key] = value
  onsettingschange(settings)
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
