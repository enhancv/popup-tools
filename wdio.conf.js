exports.config = {
    specs: [
        './test/specs/**/*.js',
    ],
    maxInstances: 5,
    capabilities: [
        {
            browserName: 'chrome',
        },
    ],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: 'http://popup-tools.dev:8080',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 20000,
    },
};
