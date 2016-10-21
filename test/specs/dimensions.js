const assert = require('chai').assert;

describe('Dimensions', function () {
    it('should open a popup with different dimensions', function () {
        browser.url('/');
        const baseWindow = browser.windowHandle().value;
        browser.click('#popup3');

        const popupWindow = browser.getTabIds().find(handle => handle !== baseWindow);
        browser.switchTab(popupWindow);
        browser.waitForExist('h1');

        const size = browser.windowHandleSize();
        const pos = browser.windowHandlePosition();

        assert.closeTo(size.value.width, 200, 100);
        assert.closeTo(size.value.height, 100, 100);

        assert.closeTo(pos.value.x, 0, 60);
        assert.closeTo(pos.value.y, 23, 60);

        browser.close();

        assert.equal(browser.getText('#result'), 'Closed with Popup closed');
    });
});
