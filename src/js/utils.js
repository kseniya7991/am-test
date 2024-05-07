/**
 * Вызывает callback тогда, когда закончилась анимация css для элемента
 * @returns
 */
export const callAfterTransition = (callback, transitionEl, waitForTransition = true) => {
    if (!waitForTransition) {
        callback();
        return;
    }

    const durationPadding = 5;

    const emulatedDuration = getTransitionDurationFromEl(transitionEl) + durationPadding;
    let isCalled = false;

    transitionEl.addEventListener("transitionend", handler);

    setTimeout(() => {
        if (!isCalled) {
            dispatchEvents(transitionEl, "transitionend");
        }
    }, emulatedDuration);

    function handler({ target }) {
        if (target !== transitionEl) return;

        isCalled = true;
        transitionEl.removeEventListener("transitionend", handler);
        callback();
    }
};

export const callCustomEvent = (events = {}, evName, ...args) => {
    execute(events[evName], ...args);
};

export const execute = (callback, ...args) => {
    if (!callback) return;
    callback(...args);
};

export const reflow = (el) => {
    el.offsetHeight;
};

export const getTransitionDurationFromEl = (el) => {
    if (!el) return 0;

    let { transitionDuration, transitionDelay } = window.getComputedStyle(el);

    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
    }

    //Если задано несколько несколько transition-duration
    transitionDuration = transitionDuration.split(",")[0];
    transitionDelay = transitionDelay.split(",")[0];

    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * 1000;
};

export const dispatchEvents = (el, events, sets = {}) => {
    let eventInit = {
        bubbles: true,
        cancelable: true,
        ...sets,
    };

    events.split(" ").forEach((ev) => {
        let customEvent = new CustomEvent(ev, eventInit);
        el.dispatchEvent(customEvent);
    });
};

export const getFromMapStorage = (map, key) => {
    return map.get(key);
};

export const setToMapStorage = (map, key, data) => {
    return map.set(key, data);
};

export const deleteFromMapStorage = (map, key) => {
    return map.delete(key);
};
