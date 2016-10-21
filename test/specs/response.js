const assert = require('chai').assert;

describe('Response', function () {
    it('should open a popup and close with message sending', function () {
        browser.url('/');
        const baseWindow = browser.windowHandle().value;
        browser.click('#popup2');
        const popupWindow = browser.getTabIds().find(handle => handle !== baseWindow);
        assert.equal(browser.getText('#result'), '');

        browser.switchTab(popupWindow);
        browser.waitForExist('#response1');
        browser.click('#response1');

        browser.waitUntil(() => !browser.getTabIds().includes(popupWindow));
        browser.switchTab(baseWindow);
        assert.equal(browser.getText('#result'), 'Data{"msg1":"Responded Successfully"}');
    });
});
