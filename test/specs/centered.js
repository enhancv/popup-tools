const assert = require('chai').assert;

describe('Centered', function () {
    it('should open a default centered popup', function () {
        browser.url('/');
        const baseWindow = browser.windowHandle().value;

        browser.click('#popup1');

        const popupWindow = browser.getTabIds().find(handle => handle !== baseWindow);

        browser.switchTab(popupWindow);
        browser.waitForExist('h1');

        const size = browser.windowHandleSize();
        const pos = browser.windowHandlePosition();

        assert.closeTo(size.value.width, 700, 50);
        assert.closeTo(size.value.height, 520, 100);

        assert.closeTo(pos.value.x, 197, 60);
        assert.closeTo(pos.value.y, 80, 60);

        browser.close();

        assert.equal(browser.getText('#result'), 'Closed with Popup closed');
    });
});
