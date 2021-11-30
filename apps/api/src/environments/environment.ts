export const environment = {
  production: false,
  linkExpireTime: 86400,
  concurrentScanJobs: 1,
  rescanCooldown: 86400 * 3 // How often someone can run message scan again for a given guild+channel pair.
};
