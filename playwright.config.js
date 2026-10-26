const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    updateSnapshots: 'none',
    snapshotPathTemplate: '{testDir}/../test-results/visual-reference/{projectName}/{arg}{ext}',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: process.env.CI ? 2 : 4,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://127.0.0.1:8000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        reducedMotion: 'reduce',
    },
    webServer: {
        command: 'node scripts/serve.mjs',
        url: 'http://127.0.0.1:8000',
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        { name: 'chromium', testIgnore: /visual\.spec\.js/, use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', testIgnore: /visual\.spec\.js/, use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', testIgnore: /visual\.spec\.js/, use: { ...devices['Desktop Safari'] } },
        {
            name: 'visual-desktop', testMatch: 'visual.spec.js',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light' },
        },
        {
            name: 'visual-mobile', testMatch: 'visual.spec.js',
            use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, deviceScaleFactor: 1, colorScheme: 'light', isMobile: true, hasTouch: true },
        },
    ],
});
