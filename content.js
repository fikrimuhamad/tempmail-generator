let clickedEl = null;

document.addEventListener("mousedown", (event) => {
    if (event.button === 2) {
        clickedEl = event.target;
    }
}, true);

function normalizeEvent(el, eventName) {
    var ev;
    if (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('Gecko/') !== -1) {
        ev = document.createEvent('KeyboardEvent');
        ev.initKeyEvent(eventName, true, false, null, false, false, false, false, 0, 0);
    } else {
        ev = el.ownerDocument.createEvent('Events');
        ev.initEvent(eventName, true, false);
        ev.charCode = 0;
        ev.keyCode = 0;
        ev.which = 0;
    }
    return ev;
}

function doFocusElement(el, setValue) {
    if (setValue) {
        var existingValue = el.value;
        el.focus();
        if (el.value !== existingValue) el.value = existingValue;
    } else {
        el.focus();
    }
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "insert_mail") {
        clickedEl.click();
        clickedEl.focus();
        clickedEl.dispatchEvent(normalizeEvent(clickedEl, 'keydown'));
        clickedEl.value = request.data;
        clickedEl.dispatchEvent(normalizeEvent(clickedEl, 'keypress'));
        clickedEl.dispatchEvent(normalizeEvent(clickedEl, 'keyup'));
        clickedEl.dispatchEvent(normalizeEvent(clickedEl, 'input'));
        clickedEl.dispatchEvent(normalizeEvent(clickedEl, 'change'));

        if (clickedEl.value !== request.data) {
            clickedEl.value = request.data;
        }
        clickedEl.click();
    }
});
