/* eslint-disable func-names */
var assert = require("chai").assert;

describe("Centered", function() {
    it(
        "should open a default centered popup",
        function() {
            var baseWindow;
            var popupWindow;
            var size;
            var pos;

            browser.url("/");
            baseWindow = browser.windowHandle().value;
            browser.click("#popup1");
            popupWindow = browser.getTabIds().find(function isNotBaseWindow(handle) {
                return handle !== baseWindow;
            });

            browser.switchTab(popupWindow);
            browser.waitForExist("h1");

            size = browser.windowHandleSize();
            pos = browser.windowHandlePosition();

            assert.closeTo(size.value.width, 700, 50);
            assert.closeTo(size.value.height, 520, 100);

            assert.closeTo(pos.value.x, 197, 60);
            assert.closeTo(pos.value.y, 80, 60);

            browser.close();

            browser.waitUntil(() => browser.getText("#result") === "Closed with Popup closed");
        },
        3
    );
});
