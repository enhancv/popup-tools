const assert = require('chai').assert;

describe('Post', function () {
    it('should post to a popup', function () {
        browser.url('/');

        const baseWindow = browser.windowHandle().value;

        browser.click('#popup5');

        const popupWindow = browser.getTabIds().find(handle => handle !== baseWindow);

        browser.switchTab(popupWindow);
        browser.waitForExist('h1');
        assert.equal(browser.getText('h1'), '{"msg":"test post"}');
        browser.close();

        assert.equal(browser.getText('#result'), 'Closed with Popup closed');
    });
});
