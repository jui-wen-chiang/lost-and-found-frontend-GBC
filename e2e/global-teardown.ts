/**
 * Global teardown: runs once after all test suites complete.
 * Currently a no-op — add cleanup logic here if needed.
 */
import { test as teardown } from '@playwright/test'

teardown('cleanup', async () => {
  // No-op for now. Add any post-run cleanup here if needed
  // (e.g., deleting test users, resetting DB state).
})
