// Import the Companion module
import { me } from 'companion';
import { settingsStorage } from 'settings';
import * as messaging from 'messaging';

const KEYS_SETTINGS = [
  'backgroundColor',
  'distanceImperialUnit',
  'imperialUnit',
  'manualLocation',
  'weatherRefreshTime',
];

// SETTINGS
// --------
if (me.launchReasons.settingsChanged) {
  // The companion was started due to application settings changes
  KEYS_SETTINGS
    .map((key) => sendValue(key, settingsStorage.getItem(key)));
}

// Event fires when a setting is changed
settingsStorage.onchange = function (evt: StorageChangeEvent) {
  sendValue(evt.key, evt.newValue);
}

function sendValue(key: string | null, val: string | null) {
  if (!val) { return }

  let computedVal;

  try { computedVal = JSON.parse(val); }
  catch { computedVal = val; }

  sendSettingData({
    key: key,
    value: computedVal,
  });
}

function sendSettingData(data: any) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
    return;
  }

  console.log("No peerSocket connection");
}
