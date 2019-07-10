import { me }           from 'appbit';
import { me as device } from 'device';

const { granted } = me.permissions

const grantedActivity = granted('access_activity')
const grantedHeartRate = granted('access_heart_rate')

const grantedPermissions: BooleanHash = {
  'elevationGain': grantedActivity && device.modelName !== 'Versa Lite',
  'hr': grantedHeartRate,
  'activeMinutes': grantedActivity,
  'steps': grantedActivity,
  'calories': grantedActivity,
  'distance': grantedActivity,
}

export const filterAllowedActivities = (activity: string) => {
  return grantedPermissions[activity] === true
}
