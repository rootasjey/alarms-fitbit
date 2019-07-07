// Fitbit SDK
import { me } from 'companion'
import { settingsStorage } from 'settings'
import * as messaging from 'messaging'

import sha256 from 'crypto-js/sha256'

const UNLOCK_CODE_HASH = '2b58d75d7ffde47141c31aac0c8b5eeb548206e61b5cad8d9ced6e573c28d966'

const KEYS_SETTINGS = [
  'foregroundColor',
  'unlockCode',
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
    const unlockCode = JSON.parse(settingsStorage.getItem('unlockCode') || '{}')

    if (!unlockCode.name) return

    const hash = sha256(unlockCode.name).toString()

    if (hash === UNLOCK_CODE_HASH) {
      messaging.peerSocket.send(data);
      return
    }
  }

  console.log("No peerSocket connection");
}
