/* eslint-disable func-names */
var assert = require('chai').assert;

describe('Position', function () {
    it('should open a popup with different position', function () {
        var baseWindow;
        var popupWindow;
        var size;
        var pos;

        browser.url('/');
        baseWindow = browser.windowHandle().value;
        browser.click('#popup4');
        popupWindow = browser
            .getTabIds()
            .find(function isNotBaseWindow(handle) {
                return handle !== baseWindow;
            });

        browser.switchTab(popupWindow);
        browser.waitForExist('h1');

        size = browser.windowHandleSize();
        pos = browser.windowHandlePosition();

        assert.closeTo(size.value.width, 200, 100);
        assert.closeTo(size.value.height, 200, 100);

        assert.closeTo(pos.value.x, 200, 60);
        assert.closeTo(pos.value.y, 300, 60);

        browser.close();

        browser.waitUntil(() => browser.getText('#result') === 'Closed with Popup closed');
    }, 3);
});
