import {
    callAfterTransition,
    callCustomEvent,
    reflow,
    dispatchEvents,
    getFromMapStorage,
    setToMapStorage,
    deleteFromMapStorage,
} from "../utils";

const INSTANCES = new Map();

const CLASS_COLLAPSE = "collapse";
const CLASS_COLLAPSING = "collapsing";
const CLASS_ACTIVE = "active";
const CLASS_DISABLED = "disabled";

export const accord = (el, settings = {}) => {
    const existedInstance = getAccordInstance(el);
    if (existedInstance) return existedInstance;
    return new Accordion(el, settings).init();
};

export const getAccordInstance = (el) => {
    return getFromMapStorage(INSTANCES, el);
};

export class Accordion {
    constructor(el, settings = {}) {
        this.el = el;
        this.trigger = this.el.querySelector(".js-accord__trigger");
        this.content = this.el.querySelector(".js-accord__body");
        this.isHover = this.el.classList.contains("js-accord-hover");

        this.excludeEl = this.el.querySelector(".js-accord-exclude");

        this.isDisabled = this.el.classList.contains(CLASS_DISABLED);
        this.isActive = this.el.classList.contains(CLASS_ACTIVE);

        this.settings = {
            ...settings,
        };
    }

    init() {
        this.el.classList.add(CLASS_COLLAPSE);
        console.log(this.el, this.trigger);

        if (this.isActive) {
            this.#toggleDataCollapse(true);
        }

        if (this.el.classList.contains("js-accord-current")) {
            this.open();
        }

        let trigger = this.trigger ? this.trigger : this.el;
        trigger.addEventListener("click", this.#handlerTrigger);

        this.isInited = true;
        this.el.classList.add("accord-inited");

        setToMapStorage(INSTANCES, this.el, this);
        return this;
    }

    open(silent = false, callbacks = {}) {
        if (this.isDisabled) return;

        this.#dispatch(this.el, "before-open", silent);
        callCustomEvent(callbacks, "before", this);

        this.#toggleDataCollapse(true);

        this.isActive = true;
        this.el.classList.remove(CLASS_COLLAPSE);
        this.el.classList.add(CLASS_COLLAPSING);

        let exclude = this.excludeEl?.scrollHeight || 0;
        let transform = this.content.dataset.hasDropdown ? this.getTransform() : 0;

        setTimeout(() => {
            this.content.style.height = this.content.scrollHeight - exclude - transform + "px";
        }, 100);

        const complete = () => {
            this.el.classList.add(CLASS_COLLAPSE, CLASS_ACTIVE);
            this.el.classList.remove(CLASS_COLLAPSING);

            this.content.style.height = "";

            this.#dispatch(this.el, "after-open", silent);
            callCustomEvent(callbacks, "after", this);
        };

        callAfterTransition(complete, this.content);
    }

    getTransform = () => {
        let style = getComputedStyle(this.excludeEl);
        let transform = style.getPropertyValue("transform");

        let reg = /[0-9]+\)/gi;
        let transformValue = transform.match(reg)[0]?.replace(")", "");

        return Number(transformValue) - 20;
    };

    close(silent = false, callbacks = {}) {
        console.log("test");
        if (this.isDisabled) return;

        this.#dispatch(this.el, "before-close", silent);
        callCustomEvent(callbacks, "before", this);

        this.#toggleDataCollapse(false);

        if (this.content) {
            this.content.style.height = this.content.getBoundingClientRect().height + "px";
            reflow(this.content);
        }

        this.isActive = false;
        this.el.classList.add(CLASS_COLLAPSING);
        this.el.classList.remove(CLASS_ACTIVE, CLASS_COLLAPSE);

        if (this.content) {
            this.content.style.height = "";
        }

        const complete = () => {
            this.el.classList.add(CLASS_COLLAPSE);
            this.el.classList.remove(CLASS_COLLAPSING);

            this.#dispatch(this.el, "after-close", silent);
            callCustomEvent(callbacks, "after", this);
        };

        if (this.content) {
            callAfterTransition(complete, this.content);
        }
    }

    destroy() {
        if (this.isActive) {
            this.close(true);
        }

        let trigger = this.trigger ? this.trigger : this.el;
        trigger.removeEventListener("click", this.#handlerTrigger);

        this.isDisabled = false;
        this.isInited = false;

        deleteFromMapStorage(INSTANCES, this.el);
    }

    disable() {
        if (this.isDisabled) return;

        this.el.classList.add(CLASS_DISABLED);
        this.isDisabled = true;
    }

    undisable() {
        if (!this.isDisabled) return;

        this.el.classList.remove(CLASS_DISABLED);
        this.isDisabled = false;
    }

    // Инициализирует свитч аккордиона по клику
    #handlerTrigger = () => {
        if (this.isActive) {
            this.close();
        } else {
            this.open();
        }
    };
    // Инициализирует свитч аккордиона по наведению
    #handlerHoverTrigger = () => {
        if (!this.isActive) {
            this.open();
        }
    };

    #dispatch(el, ev, silent) {
        if (silent) return;
        dispatchEvents(el, ev, { detail: this });
    }

    #toggleDataCollapse(isOpen) {
        let type = isOpen ? "open" : "close";
        this.el.setAttribute("data-collapse", type);
    }
}
