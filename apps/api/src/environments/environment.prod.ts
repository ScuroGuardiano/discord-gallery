export const environment = {
  production: true,
  linkExpireTime: 24 * 60 * 60 * 1000,
  concurrentScanJobs: 1,
  rescanCooldown: 3 * 24 * 60 * 60 * 1000 // How often someone can run message scan again for a given guild+channel pair.
};
