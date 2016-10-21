exports.config = {
    specs: [
        './test/specs/**/*.js',
    ],
    maxInstances: 3,
    capabilities: [
        {
            browserName: 'firefox',
            platform: 'Windows 10',
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
            build: process.env.TRAVIS_BUILD_NUMBER,
        },
        {
            browserName: 'chrome',
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
            build: process.env.TRAVIS_BUILD_NUMBER,
        },
        {
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11.0',
            exclude: [
                'test/specs/response.js',
            ],
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
            build: process.env.TRAVIS_BUILD_NUMBER,
        },
    ],
    sync: true,
    logLevel: 'silent',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: 'http://popup-tools.dev:8080',
    waitforTimeout: 20000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['sauce'],
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 40000,
    },
};
