export const rolePermissions = [
  'Dashboard',

  'Map',
  'AddMap',
  'EditMap',

  'Servers',

  'Workflows',
  'EditWorkflow',

  'Apps',
  'Search',

  'DeviceWorkflows',
  'EditDeviceWorkflow',

  'Logs',
  'Incidents',
  'Chat',
  'ThreatMap',
  'Settings',

  'CommandLine',
  'AddServer',
  'EditServer'
]


export function hasPermission(user, permission) {
  if (!(user && user.permissions && user.permissions.includes(permission))) {
    return false
  }
  return true
}