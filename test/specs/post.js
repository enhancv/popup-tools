/* eslint-disable func-names */
var assert = require("chai").assert;

describe("Post", function() {
    it(
        "should post to a popup",
        function() {
            var baseWindow;
            var popupWindow;

            browser.url("/");
            baseWindow = browser.windowHandle().value;
            browser.click("#popup5");
            popupWindow = browser.getTabIds().find(function isNotBaseWindow(handle) {
                return handle !== baseWindow;
            });

            browser.switchTab(popupWindow);
            browser.waitForExist("h1");
            assert.equal(browser.getText("h1"), '{"msg":"test post"}');
            browser.close();

            browser.waitUntil(() => browser.getText("#result") === "Closed with Popup closed");
        },
        3
    );
});
