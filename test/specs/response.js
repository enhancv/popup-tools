/* eslint-disable func-names */
var assert = require('chai').assert;

describe('Response', function () {
    it('should open a popup and close with message sending', function () {
        var baseWindow;
        var popupWindow;

        browser.url('/');
        baseWindow = browser.windowHandle().value;
        browser.click('#popup2');
        popupWindow = browser
            .getTabIds()
            .find(function isNotBaseWindow(handle) {
                return handle !== baseWindow;
            });

        assert.equal(browser.getText('#result'), '');

        browser.switchTab(popupWindow);
        browser.waitForExist('#response1');
        browser.click('#response1');

        browser.waitUntil(function isPopupClosed() {
            return !browser.getTabIds().includes(popupWindow);
        });
        browser.switchTab(baseWindow);
        assert.equal(browser.getText('#result'), 'Data{"msg1":"Responded Successfully"}');
    });
});
