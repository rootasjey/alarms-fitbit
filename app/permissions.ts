import { me } from 'appbit';

const { granted } = me.permissions

const grantedActivity = granted('access_activity')
const grantedHeartRate = granted('access_heart_rate')

const grantedPermissions: BooleanHash = {
  'elevationGain': grantedActivity,
  'hr': grantedHeartRate,
  'activeMinutes': grantedActivity,
  'steps': grantedActivity,
  'calories': grantedActivity,
  'distance': grantedActivity,
}

export const filterAllowedActivities = (activity: string) => {
  return grantedPermissions[activity] === true
}
